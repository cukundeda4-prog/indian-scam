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
  onTranscriptFinal?: (text: string) => void;
  autoSendDelayMs?: number;
}

export function useMicrophone({ onTranscriptFinal, autoSendDelayMs = 1500 }: UseMicrophoneOptions = {}) {
  const [permissionState, setPermissionState] = useState<MicPermissionState>('prompt');
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 for VU meter
  const [interimText, setInterimText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;

  const isRecognitionSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Check initial permission if supported
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setPermissionState('unsupported');
      return;
    }

    if (navigator.permissions?.query) {
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
            if (status.state === 'granted') setPermissionState('granted');
            else if (status.state === 'denied') setPermissionState('denied');
            else setPermissionState('prompt');
          };
        })
        .catch(() => {
          // Some browsers do not support microphone in permissions.query
        });
    }
  }, []);

  // Request browser microphone permission & start audio analysis
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setPermissionState('unsupported');
      setErrorMessage('Microphone is not supported in this browser.');
      return false;
    }

    try {
      setErrorMessage(null);
      // This forces the browser permission prompt: "Allow this site to use your microphone"
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      setPermissionState('granted');
      setIsMicActive(true);
      setIsMuted(false);

      // Start Web Audio VU level meter
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
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
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setAudioLevel(normalized);
          } else {
            setAudioLevel(0);
          }
          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      } catch (err) {
        console.warn('AudioContext VU meter init error:', err);
      }

      // Start Speech-to-text recognition if supported
      startRecognition();

      return true;
    } catch (err: unknown) {
      console.error('Microphone permission error:', err);
      const errorObj = err as { name?: string };
      if (errorObj?.name === 'NotAllowedError' || errorObj?.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setErrorMessage('Microphone access was denied in your browser. Please click the lock/camera icon in your address bar to allow microphone.');
      } else {
        setErrorMessage('Failed to access microphone. Please check your audio input settings.');
      }
      setIsMicActive(false);
      return false;
    }
  }, []);

  // Initialize and start Speech Recognition
  const startRecognition = useCallback(() => {
    if (!isRecognitionSupported) return;

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) return;

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (isMutedRef.current) return;

        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (interim) {
          setInterimText(interim);
        }

        if (final) {
          const trimmedFinal = final.trim();
          setFinalText((prev) => (prev ? `${prev} ${trimmedFinal}` : trimmedFinal));
          setInterimText('');

          // If user pauses speaking, trigger auto-send
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          if (onTranscriptFinal) {
            silenceTimerRef.current = setTimeout(() => {
              onTranscriptFinal(trimmedFinal);
              setFinalText('');
            }, autoSendDelayMs);
          }
        }
      };

      recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
        if (e.error !== 'no-speech') {
          console.warn('SpeechRecognition error:', e.error);
        }
      };

      recognition.onend = () => {
        // Automatically restart if mic is active and unmuted
        if (mediaStreamRef.current && !isMutedRef.current) {
          try {
            recognition.start();
          } catch {
            // Ignore if already active
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
    }
  }, [isRecognitionSupported, onTranscriptFinal, autoSendDelayMs]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextState = !prev;
      isMutedRef.current = nextState;

      // Enable/disable actual audio tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = !nextState;
        });
      }

      if (nextState) {
        setAudioLevel(0);
        setInterimText('');
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        try {
          recognitionRef.current?.stop();
        } catch {
          // Ignore
        }
      } else {
        try {
          recognitionRef.current?.start();
        } catch {
          // Ignore
        }
      }

      return nextState;
    });
  }, []);

  // Stop Microphone & cleanup
  const stopMic = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
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
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    setIsMicActive(false);
    setAudioLevel(0);
    setInterimText('');
    setFinalText('');
  }, []);

  // Clear current transcript
  const clearTranscript = useCallback(() => {
    setFinalText('');
    setInterimText('');
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

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
    interimText,
    finalText,
    errorMessage,
    isRecognitionSupported,
    requestPermission,
    toggleMute,
    stopMic,
    clearTranscript,
  };
}
