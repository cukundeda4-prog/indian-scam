import React, { useState } from 'react';
import { ScamType, VictimProfile } from '../types/game';
import { PRESET_TARGETS } from '../utils/dialogueEngine';
import { Phone, Shield, Terminal, Skull, Play, FileText, ChevronRight } from 'lucide-react';
import { playBeep, playDialTone } from '../utils/audio';

interface TitleScreenProps {
  onStartGame: (initialScam: ScamType) => void;
  onLoadGame: (saveCode: string) => boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame, onLoadGame }) => {
  const [selectedScam, setSelectedScam] = useState<ScamType>('REFUND_DEPT');
  const [saveCodeInput, setSaveCodeInput] = useState('');
  const [loadError, setLoadError] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  const handleLaunch = () => {
    playDialTone();
    onStartGame(selectedScam);
  };

  const handleLoadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveCodeInput.trim()) return;
    const ok = onLoadGame(saveCodeInput.trim());
    if (!ok) {
      setLoadError(true);
      playBeep(250, 0.2);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-emerald-400 font-mono flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-black">
      {/* Background Grid & Scanline FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Main Terminal Window Frame */}
      <div className="relative w-full max-w-3xl bg-zinc-950/95 border-2 border-emerald-500/60 rounded shadow-2xl shadow-emerald-950 overflow-hidden flex flex-col z-10">
        {/* Terminal Header */}
        <div className="bg-zinc-900 px-4 py-2 border-b border-emerald-500/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="font-bold text-zinc-300 ml-2">BOOT_INITIALIZER.SH -- [CALL CENTER TYCOON]</span>
          </div>
          <span className="text-zinc-500 text-[10px]">INITIAL BANK BALANCE: $0.00</span>
        </div>

        {/* Hero Title & Cyber Banner */}
        <div className="p-6 text-center space-y-3 border-b border-zinc-900 bg-gradient-to-b from-zinc-900/60 to-transparent">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300">
            <Terminal className="w-3.5 h-3.5" />
            <span>UNDERGROUND SCAM OPERATIONS ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            CALL CENTER TYCOON
          </h1>
          <div className="text-sm sm:text-base font-bold text-emerald-400 tracking-widest uppercase">
            SCAM OPERATOR SIMULATOR
          </div>
          <p className="max-w-xl mx-auto text-xs text-zinc-400 leading-relaxed">
            Inspired by <em>Scam With Your Friends</em>. Speak into your microphone to talk to randomized victims, and listen to their unfiltered AI voices.
            Extract credit card numbers and gift cards, manipulate victim desktops via AnyDesk, and beware of undercover scambaiters!
          </p>
        </div>

        {/* Step 1: Pick Starting Scam Persona & Target */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40">
          {/* Left: Scam Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300 uppercase">
              1. Select Starting Scam Persona
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'REFUND_DEPT', title: 'Refund Dept (Amazon/Target)', desc: 'Over-refund $5,000 instead of $50, demand gift cards.' },
                { id: 'TECH_SUPPORT', title: 'Microsoft Support (Zeus Virus)', desc: 'Scan fake trojan files on victim PC via AnyDesk.' },
                { id: 'CRYPTO_SECURITY', title: 'Coinbase/Crypto Security', desc: 'Warn caller that BTC wallet is frozen.' },
                { id: 'IRS_GOVERNMENT', title: 'IRS / Federal Dept', desc: 'Threaten arrest warrant unless taxes paid now.' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedScam(item.id as ScamType)}
                  className={`w-full text-left p-2 rounded border transition-all ${
                    selectedScam === item.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div>{item.title}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Randomized Target Pool Showcase */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-300 uppercase">
                2. Randomized Target Registry
              </label>
              <span className="text-[10px] text-emerald-400 font-bold">{PRESET_TARGETS.length} PROFILES LOADED</span>
            </div>
            <div className="space-y-1.5 text-xs max-h-56 overflow-y-auto pr-1">
              {PRESET_TARGETS.map((t) => (
                <div
                  key={t.id}
                  className="p-2 rounded border border-zinc-800 bg-zinc-900/60 text-zinc-400"
                >
                  <div className="flex justify-between items-center text-zinc-300 font-bold text-[11px]">
                    <span>{t.name}</span>
                    <span className="text-[10px] text-zinc-500">Age {t.age} · {t.archetype}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 truncate">{t.personality}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Launch Actions */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setShowLoadModal(!showLoadModal)}
            className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 underline-offset-4 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Have a Save Code? Load Game (/load)</span>
          </button>

          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/60"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>LAUNCH AUTODIALER (RANDOM CALL)</span>
          </button>
        </div>

        {/* Load Modal Drawer */}
        {showLoadModal && (
          <div className="p-4 bg-zinc-900 border-t border-emerald-900 space-y-2 text-xs">
            <div className="font-bold text-zinc-200">RESTORE SAVE STATE STRING:</div>
            <form onSubmit={handleLoadSubmit} className="flex gap-2">
              <input
                type="text"
                value={saveCodeInput}
                onChange={(e) => {
                  setSaveCodeInput(e.target.value);
                  setLoadError(false);
                }}
                placeholder="Paste code (e.g. CCT-SAVE-ey...)"
                className="flex-1 bg-black border border-zinc-700 focus:border-emerald-500 rounded px-3 py-1.5 text-xs text-emerald-300 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs"
              >
                RESTORE
              </button>
            </form>
            {loadError && (
              <div className="text-red-400 text-[11px]">
                ✖ Invalid save code format. Please check your copied string.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
