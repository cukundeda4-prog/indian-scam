import React from 'react';
import { ScamType, WindowId } from '../types/game';

interface AsciiDashboardProps {
  timeStr: string;
  day: number;
  activeScamType: ScamType;
  bankBalance: number;
  trust: number;
  suspicion: number;
  activeWindow: WindowId;
  onSelectApp: (app: WindowId) => void;
  isCallActive: boolean;
  trojansInstalled?: number;
}

export const AsciiDashboard: React.FC<AsciiDashboardProps> = ({
  timeStr,
  day,
  activeScamType,
  bankBalance,
  trust,
  suspicion,
  activeWindow,
  onSelectApp,
  isCallActive,
  trojansInstalled = 0,
}) => {
  const scamLabelMap: Record<ScamType, string> = {
    TECH_SUPPORT: 'WINDOWS TECH SUPPORT (ZEUS TROJAN)',
    CRYPTO_SECURITY: 'COINBASE CRYPTO FRAUD DEPT',
    REFUND_DEPT: 'AMAZON/TARGET REFUND OVERPAYMENT',
    IRS_GOVERNMENT: 'IRS FEDERAL TREASURY AUDIT',
  };

  const formattedBalance = bankBalance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  // Calculate ASCII visual meter bar for trust (10 blocks)
  const trustBlocks = Math.round(trust / 10);
  const trustBar = '█'.repeat(trustBlocks) + '░'.repeat(10 - trustBlocks);

  // Calculate ASCII meter bar for suspicion (10 blocks)
  const suspBlocks = Math.round(suspicion / 10);
  const suspBar = '█'.repeat(suspBlocks) + '░'.repeat(10 - suspBlocks);

  return (
    <div className="bg-zinc-950 border-b-2 border-emerald-500/40 text-emerald-400 font-mono text-xs select-none shadow-lg">
      {/* Top Header ASCII Border */}
      <div className="px-3 py-1 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between overflow-x-auto text-[11px] whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-bold">╔══ CALL CENTER TYCOON v2.4 ══╗</span>
          <span className="text-zinc-500">OPERATOR: SCAM_UNIT_047</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400">NETWORK: <span className="text-emerald-400">ENCRYPTED_VOIP</span></span>
          <span className="text-zinc-600">│</span>
          <span className="text-zinc-400">TROJANS ACTIVE: <span className="text-purple-400 font-bold tabular-nums">{trojansInstalled}</span></span>
          <span className="text-zinc-600">│</span>
          <span className="text-zinc-400">AUDIO: <span className="text-emerald-400">ONLINE</span></span>
        </div>
      </div>

      {/* Main ASCII/Text Dashboard as requested */}
      <div className="p-2 sm:px-4 grid grid-cols-2 md:grid-cols-6 gap-2 bg-black/80 border-b border-emerald-950">
        <div className="flex flex-col border border-emerald-900/60 bg-emerald-950/20 p-1.5 rounded">
          <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">TIME</span>
          <span className="text-sm font-bold text-emerald-300 tabular-nums">{timeStr}</span>
        </div>

        <div className="flex flex-col border border-emerald-900/60 bg-emerald-950/20 p-1.5 rounded">
          <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">DAY</span>
          <span className="text-sm font-bold text-emerald-300 tabular-nums">DAY {day}</span>
        </div>

        <div className="col-span-2 flex flex-col border border-emerald-900/60 bg-emerald-950/20 p-1.5 rounded overflow-hidden">
          <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">ACTIVE SCAM TYPE</span>
          <span className="text-xs font-bold text-amber-300 truncate" title={scamLabelMap[activeScamType]}>
            {scamLabelMap[activeScamType]}
          </span>
        </div>

        <div className="flex flex-col border border-emerald-900/60 bg-emerald-950/20 p-1.5 rounded">
          <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">BANK BALANCE</span>
          <span className="text-sm font-bold text-emerald-300 tabular-nums">{formattedBalance}</span>
        </div>

        <div className="flex flex-col border border-emerald-900/60 bg-emerald-950/20 p-1.5 rounded">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-emerald-500 font-semibold uppercase">CALLER TRUST</span>
            <span className="text-emerald-300 font-bold tabular-nums">{trust}%</span>
          </div>
          <div className="text-[10px] tracking-widest text-emerald-400 font-mono mt-0.5">{trustBar}</div>
        </div>

        <div className="col-span-2 md:col-span-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-zinc-800 bg-zinc-900/50 p-1.5 rounded text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-semibold uppercase">CALLER SUSPICION:</span>
            <span className="text-red-300 font-bold tabular-nums">{suspicion}%</span>
            <span className="text-red-500 tracking-widest font-mono hidden sm:inline">[{suspBar}]</span>
            {suspicion >= 75 && (
              <span className="text-[10px] text-red-400 animate-pulse font-bold bg-red-950/60 px-1.5 py-0.5 border border-red-800 rounded">
                ⚠ HIGH SUSPICION!
              </span>
            )}
          </div>
          <div className="text-zinc-400 text-[10px]">
            STATUS: {isCallActive ? <span className="text-emerald-400 font-bold animate-pulse">● CALL IN PROGRESS</span> : <span className="text-zinc-500">IDLE (LINE OPEN)</span>}
          </div>
        </div>
      </div>

      {/* Available Desktop Apps bar as requested: [1] Phone Dialer, [2] AnyDesk Remote, [3] Bank Transfer Terminal, [4] Black Market Upgrades, [5] Dark Web Wallet */}
      <div className="px-3 py-1.5 bg-zinc-900 border-t border-zinc-800 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <span className="text-zinc-500 text-[11px] mr-1 hidden lg:inline font-semibold">DESKTOP APPS:</span>
        
        <button
          onClick={() => onSelectApp('DIALER')}
          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 ${
            activeWindow === 'DIALER'
              ? 'bg-emerald-600 text-black font-bold shadow-md shadow-emerald-950'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <span>[1]</span>
          <span>Phone Dialer</span>
          {isCallActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
        </button>

        <button
          onClick={() => onSelectApp('ANYDESK')}
          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 ${
            activeWindow === 'ANYDESK'
              ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <span>[2]</span>
          <span>AnyDesk Remote</span>
        </button>

        <button
          onClick={() => onSelectApp('BANK_TERMINAL')}
          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 ${
            activeWindow === 'BANK_TERMINAL'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-950'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <span>[3]</span>
          <span>Bank Transfer Terminal</span>
        </button>

        <button
          onClick={() => onSelectApp('BLACK_MARKET')}
          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 ${
            activeWindow === 'BLACK_MARKET'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-950'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <span>[4]</span>
          <span>Black Market Upgrades</span>
        </button>

        <button
          onClick={() => onSelectApp('DARK_WEB')}
          className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 ${
            activeWindow === 'DARK_WEB'
              ? 'bg-amber-600 text-black font-bold shadow-md shadow-amber-950'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <span>[5]</span>
          <span>Dark Web Wallet</span>
        </button>
      </div>
    </div>
  );
};
