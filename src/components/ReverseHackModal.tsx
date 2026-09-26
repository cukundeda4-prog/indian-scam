import React, { useState } from 'react';
import { Skull, AlertTriangle, RefreshCw, Wrench } from 'lucide-react';
import { playHackerAlarm, playBeep } from '../utils/audio';

interface ReverseHackModalProps {
  victimName: string;
  repairCost: number;
  playerBalance: number;
  onPayRepair: () => void;
  onSolveReboot: () => void;
}

export const ReverseHackModal: React.FC<ReverseHackModalProps> = ({
  victimName,
  repairCost,
  playerBalance,
  onPayRepair,
  onSolveReboot,
}) => {
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const targetWord = 'REMOVE_MALWARE';

  const handleCaptcha = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.trim().toUpperCase() === targetWord) {
      playBeep(800, 0.2);
      onSolveReboot();
    } else {
      setCaptchaError(true);
      playHackerAlarm();
    }
  };

  return (
    <div className="fixed inset-0 bg-red-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-xl bg-black border-4 border-red-600 rounded p-6 shadow-2xl text-red-500 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-red-800 pb-3">
          <Skull className="w-10 h-10 text-red-500 animate-bounce" />
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-wider">
              ☠ SYSTEM COMPROMISED: REVERSE HACK DETECTED!
            </h2>
            <div className="text-xs text-red-400">
              TRAP TRIGGERED BY: {victimName.toUpperCase()} (SCAMBAITER)
            </div>
          </div>
        </div>

        {/* Story details */}
        <div className="p-3 bg-red-950/40 border border-red-900 rounded text-xs leading-relaxed text-red-300 space-y-2">
          <p>
            You walked straight into a trap! The victim was secretly an undercover YouTube scambaiter!
            While you were running fake tree scans, they infected your virtual call center terminal with a reverse Trojan payload and broadcasted your IP address.
          </p>
          <p className="font-bold text-red-400">
            DAMAGE REPORT: Virtual Windows C: Drive corrupted. Telephony SIP trunk offline.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Pay IT Repair Technician */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded space-y-2 flex flex-col justify-between">
            <div>
              <div className="font-bold text-white text-xs">Option 1: Emergency IT Repair</div>
              <div className="text-[11px] text-zinc-400 mt-1">
                Pay a darknet IT contractor to re-flash your virtual drive immediately.
              </div>
            </div>
            <button
              onClick={onPayRepair}
              className="w-full py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>PAY ${repairCost} REPAIR FEE</span>
            </button>
          </div>

          {/* Solve Recovery Captcha */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded space-y-2">
            <div className="font-bold text-white text-xs">Option 2: Safe Mode Reboot</div>
            <div className="text-[11px] text-zinc-400">
              Type <code className="text-amber-300">{targetWord}</code> to manually flush memory:
            </div>
            <form onSubmit={handleCaptcha} className="space-y-2">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError(false);
                }}
                placeholder="TYPE HERE..."
                className="w-full bg-black border border-zinc-700 rounded px-2.5 py-1 text-xs text-emerald-400 font-mono focus:outline-none focus:border-red-500 uppercase"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded text-xs flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>FLUSH & REBOOT PC</span>
              </button>
            </form>
            {captchaError && (
              <div className="text-[10px] text-red-400">✖ Invalid code! Try again.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
