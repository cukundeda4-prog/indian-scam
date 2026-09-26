import React, { useState } from 'react';
import { PlayerStats } from '../types/game';
import { Bitcoin, Shield, Flame, Trophy, TrendingUp, RefreshCw, ArrowUpRight } from 'lucide-react';
import { playCashRegister, playBeep } from '../utils/audio';

interface DarkWebWalletProps {
  stats: PlayerStats;
  onLaunderMoney: (amount: number) => { success: boolean; btcAdded: number };
}

export const DarkWebWallet: React.FC<DarkWebWalletProps> = ({ stats, onLaunderMoney }) => {
  const [launderInput, setLaunderInput] = useState('2000');
  const [mixerStatus, setMixerStatus] = useState<string | null>(null);
  const [isMixing, setIsMixing] = useState(false);

  const BTC_RATE = 64000; // $64,000 per BTC

  const handleMix = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(launderInput);
    if (!amount || amount <= 0 || amount > stats.balance || isMixing) {
      playBeep(250, 0.2);
      return;
    }

    setIsMixing(true);
    setMixerStatus('Tumbling funds through 64 Monero hops and privacy relays...');
    playBeep(500, 0.1);

    setTimeout(() => {
      const res = onLaunderMoney(amount);
      setIsMixing(false);
      if (res.success) {
        playCashRegister();
        setMixerStatus(`Launder complete! Cleaned $${amount.toLocaleString()} into +${res.btcAdded.toFixed(4)} BTC.`);
      } else {
        setMixerStatus('Laundering failed: Insufficient USD balance.');
      }
    }, 1500);
  };

  const getReputationRank = (balance: number) => {
    if (balance >= 50000) return { title: 'INTERNATIONAL CALL CENTER TYCOON', level: 5, color: 'text-amber-400' };
    if (balance >= 15000) return { title: 'KOLKATA FLOOR SYNDICATE BOSS', level: 4, color: 'text-purple-400' };
    if (balance >= 5000) return { title: 'SENIOR CLOSER SPECIALIST', level: 3, color: 'text-blue-400' };
    if (balance >= 1000) return { title: 'JAMTARA DIALER TRAINEE', level: 2, color: 'text-emerald-400' };
    return { title: 'SCRIPT KIDDIE OPERATOR', level: 1, color: 'text-zinc-400' };
  };

  const rank = getReputationRank(stats.balance);

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono select-none overflow-hidden">
      {/* Title Bar */}
      <div className="bg-amber-950 px-3 py-1.5 border-b border-amber-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Bitcoin className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-white">ELECTRUM_DARKNET_VAULT.EXE - [Offshore Crypto Mixer]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400">BTC Rate:</span>
          <span className="text-xs font-bold text-amber-400 tabular-nums">
            ${BTC_RATE.toLocaleString()}/BTC
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-w-4xl mx-auto w-full space-y-4">
        {/* Balances Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">
            <div className="text-[11px] text-zinc-400 font-bold uppercase">BITCOIN (CLEANED)</div>
            <div className="text-xl font-bold text-amber-400 tabular-nums mt-1 flex items-center gap-1">
              <span>₿ {stats.darkWebCryptoBtc.toFixed(4)}</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">
              ≈ ${(stats.darkWebCryptoBtc * BTC_RATE).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
            </div>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">
            <div className="text-[11px] text-zinc-400 font-bold uppercase">UNLAUNDERED CASH</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums mt-1">
              ${stats.balance.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Susceptible to bank freeze</div>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">
            <div className="text-[11px] text-zinc-400 font-bold uppercase">SYNDICATE RANK</div>
            <div className={`text-sm font-bold mt-1 truncate ${rank.color}`}>
              {rank.title}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Tier {rank.level} of 5</div>
          </div>
        </div>

        {/* Money Laundering Mixer */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
            <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>DARKNET CRYPTO TUMBLER & MIXER</span>
            </span>
            <span className="text-[10px] text-zinc-500">MONERO ZERO-KNOWLEDGE RELAYS</span>
          </div>
          <p className="text-xs text-zinc-400">
            Launder hot fiat money obtained from compromised victims into untraceable offshore Bitcoin. Washed Bitcoin permanently boosts your Tycoon Net Worth!
          </p>

          <form onSubmit={handleMix} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-zinc-500 text-xs">$</span>
              <input
                type="number"
                value={launderInput}
                onChange={(e) => setLaunderInput(e.target.value)}
                placeholder="Amount to wash"
                max={stats.balance}
                className="w-full bg-black border border-zinc-700 rounded pl-7 pr-3 py-1.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isMixing || stats.balance <= 0}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-bold rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-950"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isMixing ? 'animate-spin' : ''}`} />
              <span>{isMixing ? 'TUMBLING...' : 'TUMBLE & CONVERT TO BTC'}</span>
            </button>
          </form>

          {mixerStatus && (
            <div className="p-2 bg-black/60 border border-amber-900/50 rounded text-amber-300 text-xs font-mono">
              {mixerStatus}
            </div>
          )}
        </div>

        {/* Lifetime Tycoon Stats Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded space-y-2">
          <div className="font-bold text-zinc-300 text-xs uppercase mb-2 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>OPERATOR LIFETIME DOSSIER</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
              <div className="text-[10px] text-zinc-500">SUCCESSFUL SCAMS</div>
              <div className="text-base font-bold text-emerald-400 tabular-nums">{stats.successfulScams}</div>
            </div>
            <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
              <div className="text-[10px] text-zinc-500">FAILED / HANG UPS</div>
              <div className="text-base font-bold text-zinc-400 tabular-nums">{stats.failedCalls}</div>
            </div>
            <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
              <div className="text-[10px] text-zinc-500">SCAMBAITER HACKS SUFFERED</div>
              <div className="text-base font-bold text-red-400 tabular-nums">{stats.reverseHacksSuffered}</div>
            </div>
            <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
              <div className="text-[10px] text-zinc-500">DAYS ACTIVE</div>
              <div className="text-base font-bold text-blue-400 tabular-nums">{stats.day}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
