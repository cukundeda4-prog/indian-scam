import React from 'react';
import { Skull, ShieldAlert, Download, CheckCircle2, DollarSign, Database, Lock, Key } from 'lucide-react';
import { VictimProfile } from '../types/game';
import { playCashRegister } from '../utils/audio';

interface TrojanExfiltrationModalProps {
  victim: VictimProfile;
  stolenAmount: number;
  onClaimLoot: () => void;
}

export const TrojanExfiltrationModal: React.FC<TrojanExfiltrationModalProps> = ({
  victim,
  stolenAmount,
  onClaimLoot,
}) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-xl bg-zinc-950 border-4 border-emerald-500 rounded p-6 shadow-2xl text-emerald-400 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-emerald-800 pb-3">
          <div className="p-2.5 rounded bg-emerald-950 border border-emerald-600 animate-pulse">
            <Download className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-wider">
              ☠ TROJAN PAYLOAD EXECUTED!
            </h2>
            <div className="text-xs text-emerald-400 font-bold">
              VICTIM CLICKED THE PHISHING LINK: {victim.name.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Narrative / Status */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded text-xs space-y-1.5 text-zinc-300">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>MALICIOUS INFECTION COMPLETE (SUSPICION WAS &lt; 20%)</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            The victim clicked your spoofed security link and granted admin permissions. The Zeus backdoor has bypassed their antivirus, dumped their browser cookies, and scraped all saved payment methods!
          </p>
        </div>

        {/* Stolen Credentials Readout */}
        <div className="p-3.5 bg-black border border-zinc-800 rounded space-y-2 text-xs">
          <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5 border-b border-zinc-900 pb-1">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>EXFILTRATED CREDENTIALS & SENSITIVE DATA:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">SAVED CREDIT CARD</span>
              <span className="text-emerald-300 font-bold font-mono tracking-wider">
                {victim.hiddenCardNumber || '4112 8821 0024 9912'}
              </span>
              <span className="text-zinc-400 block text-[10px] mt-0.5">
                CVV: {victim.hiddenCvv || '341'} · EXP: {victim.hiddenExpiry || '11/27'}
              </span>
            </div>

            <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">BANK ACCOUNT ACCESS</span>
              <span className="text-emerald-300 font-bold">
                ${victim.bankBalance.toLocaleString()}
              </span>
              <span className="text-zinc-400 block text-[10px] mt-0.5">
                STATUS: ROOT COMPROMISED
              </span>
            </div>

            {victim.hiddenGiftCard && (
              <div className="col-span-2 p-2 bg-zinc-900 rounded border border-zinc-800 flex justify-between items-center">
                <div>
                  <span className="text-zinc-500 block text-[10px]">SAVED GIFT CARD CODE</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {victim.hiddenGiftCard}
                  </span>
                </div>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold">
                  UNREDEEMED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payout & Claim button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] text-zinc-500 uppercase block">Total Loot Extracted</span>
            <span className="text-2xl font-extrabold text-emerald-400 tabular-nums">
              +${stolenAmount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => {
              playCashRegister();
              onClaimLoot();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950"
          >
            <DollarSign className="w-4 h-4 fill-black" />
            <span>DRAIN ACCOUNT & COLLECT LOOT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
