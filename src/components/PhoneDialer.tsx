import React, { useState, useRef, useEffect } from 'react';
import { ActiveCall, ScamType } from '../types/game';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  HelpCircle,
  ShieldAlert,
  Cpu,
  RefreshCw,
  Send,
  Radio,
  Shuffle,
  Link2,
} from 'lucide-react';
import { playBeep, playKeyboardClick } from '../utils/audio';
import { useMicrophone } from '../hooks/useMicrophone';



interface PhoneDialerProps {
  currentCall: ActiveCall | null;
  activeScamType: ScamType;
  onSetScamType: (scam: ScamType) => void;
  onStartRandomCall: (scamType?: ScamType) => void;
  onHangup: () => void;
  onSendMessage: (msg: string) => void;
  onConnectAnydesk: () => void;
  onSendMaliciousLink: () => void;
  onCommand: (command: string) => void;
  isProcessing: boolean;
  isCallerSpeaking: boolean;
}

export const PhoneDialer: React.FC<PhoneDialerProps> = ({
  currentCall,
  activeScamType,
  onSetScamType,
  onStartRandomCall,
  onHangup,
  onSendMessage,
  onConnectAnydesk,
  onSendMaliciousLink,
  onCommand,
  isProcessing,
  isCallerSpeaking,
}) => {
  const [inputText, setInputText] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const {
    permissionState,
    isMicActive,
    isMuted: isMicMuted,
    audioLevel,
    liveTranscript,
    errorMessage: micError,
    showPermissionGuide,
    setShowPermissionGuide,
    isRecognitionSupported,
    requestPermission,
    toggleMute,
    stopMic,
    clearLiveTranscript,
  } = useMicrophone({
    onLiveTranscript: (spokenText) => {
      // Live streaming: instantly shows words in the input box as you speak
      setInputText(spokenText);
    },
    onTranscriptComplete: (finalSpokenText) => {
      // Auto-send when user stops talking (detected silence)
      if (finalSpokenText && currentCall && currentCall.status === 'connected' && !isProcessing) {
        playKeyboardClick();
        setInputText('');
        clearLiveTranscript();
        onSendMessage(finalSpokenText);
      }
    },
    silenceDelayMs: 1100,
  });

  // Auto-scroll chat transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentCall?.history]);

  const handleToggleMicOrPermission = async () => {
    if (!isMicActive) {
      playBeep(700, 0.1);
      await requestPermission();
    } else {
      playBeep(isMicMuted ? 800 : 350, 0.1);
      toggleMute();
    }
  };







  const scamOptions: { id: ScamType; label: string; desc: string }[] = [
    {
      id: 'TECH_SUPPORT',
      label: 'Windows Tech Support',
      desc: 'Claim Zeus Trojan virus, scan PC files via AnyDesk',
    },
    {
      id: 'CRYPTO_SECURITY',
      label: 'Coinbase/Crypto Security',
      desc: 'Claim Bitcoin wallet is drained, demand gas fee card',
    },
    {
      id: 'REFUND_DEPT',
      label: 'Refund Dept (Amazon/Target)',
      desc: 'Over-refund $5,000 instead of $50, demand gift cards',
    },
    {
      id: 'IRS_GOVERNMENT',
      label: 'IRS / Federal Dept',
      desc: 'Threaten sheriff arrest warrant unless settled now',
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    playKeyboardClick();

    const text = inputText.trim();
    setInputText('');
    clearLiveTranscript();

    if (text.startsWith('/')) {
      onCommand(text);
    } else {
      onSendMessage(text);
    }
  };

  const handleMacro = (macroText: string) => {
    if (isProcessing || !currentCall) return;
    playBeep(700, 0.08);
    onSendMessage(macroText);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono select-none overflow-hidden">
      {/* Window Title Bar */}
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-3 py-1.5 border-b border-zinc-700 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-zinc-200">
            AUTO_DIALER_VOIP.EXE - [Random Target Telephony Terminal]
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Caller Audio Voice Status */}
          {isCallerSpeaking && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600 text-[11px] text-emerald-300 font-bold animate-pulse">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI VOICE SPEAKING...</span>
              <div className="flex gap-0.5 items-end h-3">
                <span className="w-1 bg-emerald-400 h-2 animate-bounce" />
                <span className="w-1 bg-emerald-400 h-3 animate-bounce [animation-delay:0.1s]" />
                <span className="w-1 bg-emerald-400 h-1.5 animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          )}

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-emerald-400 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 hover:border-emerald-500"
          >
            <HelpCircle className="w-3 h-3" />
            <span>/help commands</span>
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="bg-black/90 border-b border-emerald-500/50 p-3 text-xs text-emerald-400 space-y-1 z-20">
          <div className="font-bold text-emerald-300 pb-1 border-b border-emerald-900 flex justify-between">
            <span>TERMINAL COMMANDS CHEATSHEET:</span>
            <button onClick={() => setShowHelp(false)} className="text-zinc-400 hover:text-white">
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
            <div>
              <code className="text-amber-300">/dial</code> - Autodial a randomized victim
            </div>
            <div>
              <code className="text-amber-300">/send_link</code> - Send phishing / Trojan link (Requires Suspicion &lt; 20%)
            </div>
            <div>
              <code className="text-amber-300">/connect</code> - Request AnyDesk remote session
            </div>
            <div>
              <code className="text-amber-300">/input_card [16-Digits] [CVV]</code> - Log stolen credit card
            </div>
            <div>
              <code className="text-amber-300">/input_giftcard [Code]</code> - Redeem gift card code
            </div>
            <div>
              <code className="text-amber-300">/hangup</code> - Terminate active call
            </div>
            <div>
              <code className="text-amber-300">/save</code> - Generate save state code
            </div>
            <div>
              <code className="text-amber-300">/load [Code]</code> - Restore save state
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Call Controls & Autodialer (4 cols) */}
        <div className="lg:col-span-4 border-r border-zinc-800 bg-zinc-950 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* Active Scam Persona Picker */}
          <div>
            <div className="text-[11px] text-zinc-400 font-bold uppercase mb-1.5 flex items-center justify-between">
              <span>1. Choose Scam Persona</span>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="space-y-1.5">
              {scamOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    playBeep(450, 0.05);
                    onSetScamType(opt.id);
                  }}
                  className={`w-full text-left p-2 rounded text-xs border transition-all ${
                    activeScamType === opt.id
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{opt.label}</span>
                    {activeScamType === opt.id && (
                      <span className="text-[10px] text-emerald-400">ACTIVE</span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Autodialer & Active Caller Card */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-[11px] text-zinc-400 font-bold uppercase mb-1.5 flex items-center justify-between">
                <span>2. Connected Target</span>
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              {currentCall ? (
                <div className="p-3 rounded bg-zinc-900 border border-zinc-800 text-xs space-y-2">
                  <div className="flex justify-between items-center text-zinc-200 font-bold">
                    <span className="text-sm text-emerald-300">{currentCall.victim.name}</span>
                    <span className="text-[10px] text-zinc-400">Age {currentCall.victim.age}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">{currentCall.victim.location}</div>
                  <p className="text-[11px] text-zinc-300 italic border-l-2 border-emerald-500 pl-2 py-0.5">
                    "{currentCall.victim.personality}"
                  </p>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-[11px]">
                    <span className="text-zinc-400">
                      Est. Bank: <span className="text-emerald-400 font-bold">${currentCall.victim.bankBalance.toLocaleString()}</span>
                    </span>
                    {currentCall.victim.isSpecialTrap && (
                      <span className="text-red-400 font-bold animate-pulse">⚠ HIGH RISK</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded bg-zinc-900/60 border border-dashed border-zinc-800 text-center text-zinc-500 text-xs space-y-2">
                  <Shuffle className="w-8 h-8 mx-auto text-zinc-600 animate-pulse" />
                  <div className="font-bold text-zinc-400">AUTODIALER ON STANDBY</div>
                  <p className="text-[11px] text-zinc-500">
                    Targets are completely randomized! Launch the autodialer to connect with a random victim across North America.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3">
              {!currentCall ? (
                <button
                  onClick={() => onStartRandomCall(activeScamType)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded flex items-center justify-center gap-2 text-xs transition-colors shadow-lg shadow-emerald-950"
                >
                  <Shuffle className="w-4 h-4 fill-black" />
                  <span>AUTODIAL RANDOM TARGET (/dial)</span>
                </button>
              ) : (
                <div className="space-y-2">
                  {/* Phishing / Trojan Link button */}
                  <button
                    onClick={onSendMaliciousLink}
                    disabled={currentCall.trojanInfected}
                    className={`w-full py-2 px-2 text-xs font-bold rounded flex flex-col items-center justify-center gap-0.5 transition-all ${
                      currentCall.trojanInfected
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/60 cursor-default'
                        : currentCall.suspicion < 20
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950 animate-pulse'
                        : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-purple-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-purple-300" />
                      <span>{currentCall.trojanInfected ? '✓ TROJAN VIRUS ACTIVE' : 'SEND PHISHING LINK (/send_link)'}</span>
                    </div>
                    <span className="text-[10px] text-zinc-300 font-normal">
                      {currentCall.trojanInfected
                        ? 'Credentials dumped & root backdoor open'
                        : currentCall.suspicion < 20
                        ? '● VICTIM TRUSTING (READY TO CLICK!)'
                        : `Need Suspicion < 20% (Current: ${currentCall.suspicion}%)`}
                    </span>
                  </button>

                  <button
                    onClick={onConnectAnydesk}
                    disabled={currentCall.anydeskConnected}
                    className={`w-full py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all ${
                      currentCall.anydeskConnected
                        ? 'bg-zinc-800 text-emerald-400 border border-emerald-600/40 cursor-default'
                        : 'bg-red-700 hover:bg-red-600 text-white'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                    <span>
                      {currentCall.anydeskConnected ? '✓ ANYDESK CONNECTED' : 'SEND ANYDESK LINK (/connect)'}
                    </span>
                  </button>

                  <button
                    onClick={onHangup}
                    className="w-full py-2 bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 font-bold rounded flex items-center justify-center gap-2 text-xs transition-colors"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>HANG UP CALL (/hangup)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Live Call Transcript & Macro Scripts (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-zinc-950">
          {/* Active Call Status Header */}
          <div className="px-3 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentCall ? 'bg-emerald-500 animate-ping' : 'bg-zinc-600'
                }`}
              />
              <span className="font-bold text-zinc-200">
                {currentCall
                  ? `LINE 1: CONNECTED WITH ${currentCall.victim.name.toUpperCase()}`
                  : 'LINE 1: NO ACTIVE CALL'}
              </span>
            </div>
            {currentCall && (
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-zinc-400">
                  Duration:{' '}
                  <span className="text-zinc-200">
                    {Math.floor(currentCall.durationSeconds / 60)}:
                    {(currentCall.durationSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </span>
                <span className="text-zinc-600">│</span>
                <span className="text-emerald-400 font-bold">TRUST: {currentCall.trust}%</span>
                <span className="text-zinc-600">│</span>
                <span className="text-red-400 font-bold">SUSPICION: {currentCall.suspicion}%</span>
              </div>
            )}
          </div>

          {/* Interactive Microphone & VOIP Line Controls */}
          {currentCall && (
            <div className="border-b border-zinc-800">
              {permissionState === 'denied' || showPermissionGuide ? (
                <div className="bg-red-950/80 p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-red-200 border-b border-red-800">
                  <div className="flex items-center gap-2">
                    <MicOff className="w-4 h-4 text-red-400 shrink-0" />
                    <span>
                      <strong>MIC ACCESS BLOCKED:</strong> Click the <strong>lock/settings icon 🔒</strong> on the left side of your browser URL bar, set <strong>Microphone</strong> to <strong>"Allow"</strong>, then click Try Again!
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => requestPermission()}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[11px] transition-colors"
                    >
                      TRY AGAIN
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPermissionGuide(false)}
                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px]"
                    >
                      DISMISS
                    </button>
                  </div>
                </div>
              ) : !isMicActive ? (
                <div className="bg-amber-950/40 p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>
                      <strong>LIVE VOIP MICROPHONE:</strong> Speak directly to {currentCall.victim.name} using your voice! Words auto-type & auto-send on pause.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleMicOrPermission}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-950"
                  >
                    <Mic className="w-3.5 h-3.5 fill-black" />
                    <span>ENABLE MICROPHONE</span>
                  </button>
                </div>
              ) : (
                <div className="bg-zinc-950 p-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Status & Real VU Volume Meter */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isMicMuted ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'
                      }`}
                    />
                    <span className="font-bold text-[11px] text-zinc-300">
                      {isMicMuted ? 'YOUR MIC: MUTED (OFF-LINE)' : 'YOUR MIC: LIVE (AUTO-SENDS ON PAUSE)'}
                    </span>

                    {/* Animated VU Meter Bars based on real input volume */}
                    {!isMicMuted && (
                      <div className="flex items-center gap-0.5 h-3.5 px-1.5 py-0.5 bg-black rounded border border-zinc-800">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-full rounded-sm transition-all duration-75 ${
                              audioLevel > (i + 1) * 11
                                ? i >= 6
                                  ? 'bg-red-500'
                                  : i >= 3
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                                : 'bg-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {liveTranscript && (
                      <span className="text-[11px] text-emerald-400 italic truncate max-w-xs">
                        "{liveTranscript}"
                      </span>
                    )}
                  </div>

                  {/* Quick Mute / Unmute Button */}
                  <button
                    type="button"
                    onClick={handleToggleMicOrPermission}
                    className={`px-3 py-1 rounded text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                      isMicMuted
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-sm'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/50'
                    }`}
                  >
                    {isMicMuted ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-white" />
                        <span>UNMUTE MIC</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        <span>MUTE MYSELF</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Chat Transcript Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-xs">
            {!currentCall ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6 space-y-3">
                <Phone className="w-12 h-12 text-zinc-700 animate-pulse" />
                <div className="font-bold text-zinc-300 text-sm">RANDOM AUTODIALER READY</div>
                <p className="max-w-md text-xs text-zinc-400 leading-relaxed">
                  Hit <span className="text-emerald-400 font-bold">AUTODIAL RANDOM TARGET</span> or type{' '}
                  <code className="text-emerald-400">/dial</code>. Turn on your microphone to speak in real-time with the caller!
                </p>
              </div>
            ) : (
              currentCall.history.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded border max-w-[85%] ${
                    msg.sender === 'player'
                      ? 'ml-auto bg-emerald-950/40 border-emerald-800 text-emerald-200'
                      : msg.sender === 'victim'
                      ? 'mr-auto bg-zinc-900 border-zinc-700 text-zinc-200'
                      : 'mx-auto bg-zinc-900/60 border-zinc-800 text-amber-400 text-center text-[11px]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] mb-1 font-bold">
                    <span
                      className={
                        msg.sender === 'player'
                          ? 'text-emerald-400'
                          : msg.sender === 'victim'
                          ? 'text-amber-400'
                          : 'text-zinc-400'
                      }
                    >
                      {msg.sender === 'player'
                        ? 'OPERATOR (YOU)'
                        : msg.sender === 'victim'
                        ? currentCall.victim.name.toUpperCase()
                        : 'SYSTEM LOG'}
                    </span>
                    <span className="text-zinc-500">{msg.timestamp}</span>
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                  {msg.impact && (
                    <div className="mt-1 pt-1 border-t border-zinc-800/80 flex gap-2 text-[10px]">
                      {msg.impact.trustDelta !== undefined && msg.impact.trustDelta !== 0 && (
                        <span
                          className={
                            msg.impact.trustDelta > 0
                              ? 'text-emerald-400 font-bold'
                              : 'text-red-400 font-bold'
                          }
                        >
                          {msg.impact.trustDelta > 0
                            ? `+${msg.impact.trustDelta}%`
                            : `${msg.impact.trustDelta}%`}{' '}
                          Trust
                        </span>
                      )}
                      {msg.impact.suspicionDelta !== undefined && msg.impact.suspicionDelta !== 0 && (
                        <span
                          className={
                            msg.impact.suspicionDelta > 0
                              ? 'text-red-400 font-bold'
                              : 'text-emerald-400 font-bold'
                          }
                        >
                          {msg.impact.suspicionDelta > 0
                            ? `+${msg.impact.suspicionDelta}%`
                            : `${msg.impact.suspicionDelta}%`}{' '}
                          Suspicion
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            {isProcessing && (
              <div className="mr-auto p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Victim is speaking / generating voice...</span>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Quick Script Macros */}
          {currentCall && (
            <div className="p-2 bg-zinc-900/60 border-t border-zinc-800 overflow-x-auto whitespace-nowrap flex gap-1.5 text-[11px]">
              <span className="text-zinc-500 text-[10px] self-center mr-1">MACROS:</span>
              <button
                onClick={() =>
                  handleMacro("DO NOT TOUCH YOUR MOUSE OR KEYBOARD MA'AM! DO NOT TOUCH IT!")
                }
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 hover:border-emerald-500"
              >
                🛑 "Do NOT touch mouse!"
              </button>
              <button
                onClick={() =>
                  handleMacro("We have detected a foreign Zeus Trojan virus from Russian IP addresses.")
                }
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 hover:border-emerald-500"
              >
                🛡 "Zeus Trojan Alert"
              </button>
              <button
                onClick={() =>
                  handleMacro(
                    "I have accidentally refunded $5,000 to your bank instead of $50! Please help me!"
                  )
                }
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 hover:border-emerald-500"
              >
                💸 "Accidental $5,000 Refund"
              </button>
              <button
                onClick={() =>
                  handleMacro(
                    "Kindly read the 16 digit card number and CVV on the back for security verification."
                  )
                }
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 hover:border-emerald-500"
              >
                💳 "Request Card & CVV"
              </button>
              <button
                onClick={() =>
                  handleMacro(
                    "You need to drive to Target or Walmart right now and buy safety gift card vouchers!"
                  )
                }
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 hover:border-emerald-500"
              >
                🎁 "Buy Gift Cards"
              </button>
            </div>
          )}

          {/* Interactive Microphone & Dialogue Input Bar */}
          <form onSubmit={handleSend} className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex gap-2">
            {/* Microphone Button with Mute / Unmute / Permission */}
            <button
              type="button"
              onClick={handleToggleMicOrPermission}
              title={
                !isMicActive
                  ? 'Click to grant browser microphone permission'
                  : isMicMuted
                  ? 'Click to unmute microphone'
                  : 'Click to mute yourself'
              }
              className={`px-3 py-2 rounded text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                !isMicActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-950 animate-pulse'
                  : isMicMuted
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-sm'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-md shadow-emerald-950 animate-pulse'
              }`}
            >
              {!isMicActive ? (
                <>
                  <Mic className="w-4 h-4 fill-black text-black" />
                  <span className="hidden sm:inline">ALLOW MIC</span>
                </>
              ) : isMicMuted ? (
                <>
                  <MicOff className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">MUTED</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-black fill-black" />
                  <span className="hidden sm:inline">MIC LIVE</span>
                </>
              )}
            </button>

            {/* Text Input with Live Speech Transcript preview */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isMicActive && !isMicMuted
                    ? liveTranscript
                      ? `Heard: "${liveTranscript}" (auto-sending on pause)...`
                      : 'Speak now into microphone (auto-types & auto-sends)...'
                    : currentCall
                    ? 'Type dialogue or command (/send_link, /connect, /hangup)...'
                    : 'Type /dial to autodial a random caller...'
                }
                className={`w-full bg-black border rounded px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono transition-colors ${
                  isMicActive && !isMicMuted
                    ? 'border-emerald-500 shadow-sm shadow-emerald-950'
                    : 'border-zinc-700 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-black font-bold rounded text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
