import { useState, useEffect, useRef, useCallback } from 'react';

// Declarations for browser SpeechRecognition APIs
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export type MicPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

interface UseMicrophoneOptions {
  onLiveTranscript?: (text: string) => void;
  onTranscriptComplete?: (text: string) => void;
  silenceDelayMs?: number; // Time of silence after speaking before auto-sending (default ~1000ms)
}

export function useMicrophone({
  onLiveTranscript,
  onTranscriptComplete,
  silenceDelayMs = 1100,
}: UseMicrophoneOptions = {}) {
  const [permissionState, setPermissionState] = useState<MicPermissionState>('prompt');
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 for VU meter
  const [liveTranscript, setLiveTranscript] = useState('');
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;

  const currentAccumulatedTextRef = useRef('');
  const isManuallyStoppedRef = useRef(false);

  const isRecognitionSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Check initial permission state if browser permits query
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((status) => {
          if (status.state === 'granted') {
            setPermissionState('granted');
          } else if (status.state === 'denied') {
            setPermissionState('denied');
          } else {
            setPermissionState('prompt');
          }
          status.onchange = () => {
            if (status.state === 'granted') {
              setPermissionState('granted');
              setShowPermissionGuide(false);
            } else if (status.state === 'denied') {
              setPermissionState('denied');
            } else {
              setPermissionState('prompt');
            }
          };
        })
        .catch(() => {
          // Some browsers do not support microphone query
        });
    }
  }, []);

  // Cleanup VU meter audio context
  const cleanupAudioMeter = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Ignore
      }
      audioCtxRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  // Setup Web Audio VU Meter from stream
  const setupAudioMeter = useCallback((stream: MediaStream) => {
    cleanupAudioMeter();
    mediaStreamRef.current = stream;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!isMutedRef.current && analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Scale non-linearly for responsive visual display
          const normalized = Math.min(100, Math.round((avg / 90) * 100));
          setAudioLevel(normalized);
        } else {
          setAudioLevel(0);
        }
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err) {
      console.warn('AudioContext VU meter setup failed:', err);
    }
  }, [cleanupAudioMeter]);

  // Stop Silence Timer
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Trigger auto-send of accumulated text
  const dispatchComplete = useCallback(() => {
    clearSilenceTimer();
    const textToSend = currentAccumulatedTextRef.current.trim();
    if (textToSend) {
      currentAccumulatedTextRef.current = '';
      setLiveTranscript('');
      if (onTranscriptComplete) {
        onTranscriptComplete(textToSend);
      }
    }
  }, [clearSilenceTimer, onTranscriptComplete]);

  // Start Speech Recognition Engine
  const startRecognition = useCallback(() => {
    if (!isRecognitionSupported) {
      setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // Stop existing instance if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) return;

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsMicActive(true);
        setErrorMessage(null);
        setPermissionState('granted');
        setShowPermissionGuide(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (isMutedRef.current) return;

        let transcriptThisTurn = '';
        let isFinalTurn = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          transcriptThisTurn += item[0].transcript;
          if (item.isFinal) {
            isFinalTurn = true;
          }
        }

        const trimmed = transcriptThisTurn.trim();
        if (!trimmed) return;

        // Keep accumulated text updated
        currentAccumulatedTextRef.current = trimmed;
        setLiveTranscript(trimmed);

        // Immediately update live display so user watches their words typed in real time
        if (onLiveTranscript) {
          onLiveTranscript(trimmed);
        }

        // Reset silence timer on every spoken syllable / word
        clearSilenceTimer();

        // Auto-send when user finishes talking
        silenceTimerRef.current = setTimeout(() => {
          dispatchComplete();
        }, isFinalTurn ? 800 : silenceDelayMs);
      };

      recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
        console.warn('SpeechRecognition error:', e.error);
        if (e.error === 'not-allowed') {
          setPermissionState('denied');
          setShowPermissionGuide(true);
          setErrorMessage('Microphone access is blocked by your browser. Please allow microphone in your address bar.');
          setIsMicActive(false);
        } else if (e.error === 'no-speech') {
          // If no speech, keep listening without error
        } else if (e.error === 'network') {
          setErrorMessage('Speech recognition network error. Please check your internet connection.');
        }
      };

      recognition.onend = () => {
        // Auto-restart if still unmuted and not manually stopped
        if (!isManuallyStoppedRef.current && !isMutedRef.current) {
          try {
            recognition.start();
          } catch {
            // Might already be active
          }
        }
      };

      isManuallyStoppedRef.current = false;
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
    }
  }, [isRecognitionSupported, onLiveTranscript, silenceDelayMs, clearSilenceTimer, dispatchComplete]);

  // Request browser microphone access & start speech recognition
  const requestPermission = useCallback(async (): Promise<boolean> => {
    isManuallyStoppedRef.current = false;
    setErrorMessage(null);

    // 1. Try to get native MediaStream for real-time VU meter
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        setupAudioMeter(stream);
        setPermissionState('granted');
        setShowPermissionGuide(false);
      } catch (err: unknown) {
        console.warn('getUserMedia error (falling back to speech recognition):', err);
        const errorObj = err as { name?: string };
        if (errorObj?.name === 'NotAllowedError' || errorObj?.name === 'PermissionDeniedError') {
          setPermissionState('denied');
          setShowPermissionGuide(true);
          setErrorMessage('Microphone is blocked in browser settings. Click the lock/camera icon in your address bar to Allow.');
        }
      }
    }

    // 2. Start speech recognition directly
    startRecognition();
    setIsMicActive(true);
    setIsMuted(false);
    return true;
  }, [setupAudioMeter, startRecognition]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      isMutedRef.current = nextMuted;

      // Physically mute media stream tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = !nextMuted;
        });
      }

      if (nextMuted) {
        clearSilenceTimer();
        setAudioLevel(0);
        setLiveTranscript('');
        try {
          recognitionRef.current?.stop();
        } catch {
          // Ignore
        }
      } else {
        // Unmuting: resume speech recognition
        isManuallyStoppedRef.current = false;
        try {
          recognitionRef.current?.start();
        } catch {
          startRecognition();
        }
      }

      return nextMuted;
    });
  }, [clearSilenceTimer, startRecognition]);

  // Force stop microphone
  const stopMic = useCallback(() => {
    isManuallyStoppedRef.current = true;
    clearSilenceTimer();
    cleanupAudioMeter();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }

    setIsMicActive(false);
    setAudioLevel(0);
    setLiveTranscript('');
    currentAccumulatedTextRef.current = '';
  }, [clearSilenceTimer, cleanupAudioMeter]);

  // Clear live transcription
  const clearLiveTranscript = useCallback(() => {
    clearSilenceTimer();
    setLiveTranscript('');
    currentAccumulatedTextRef.current = '';
  }, [clearSilenceTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMic();
    };
  }, [stopMic]);

  return {
    permissionState,
    isMicActive,
    isMuted,
    audioLevel,
    liveTranscript,
    errorMessage,
    showPermissionGuide,
    setShowPermissionGuide,
    isRecognitionSupported,
    requestPermission,
    toggleMute,
    stopMic,
    clearLiveTranscript,
  };
}
