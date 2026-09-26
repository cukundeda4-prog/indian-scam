import React from 'react';
import { Upgrade } from '../types/game';
import { ShoppingCart, Check, Zap, ShieldCheck, Radio, Headphones, Cpu, Lock } from 'lucide-react';
import { playCashRegister, playBeep } from '../utils/audio';

interface BlackMarketShopProps {
  balance: number;
  upgrades: Upgrade[];
  onPurchaseUpgrade: (id: string) => boolean;
}

export const BlackMarketShop: React.FC<BlackMarketShopProps> = ({
  balance,
  upgrades,
  onPurchaseUpgrade,
}) => {
  const handleBuy = (upgrade: Upgrade) => {
    if (balance < upgrade.cost || upgrade.purchased) {
      playBeep(250, 0.2);
      return;
    }
    const success = onPurchaseUpgrade(upgrade.id);
    if (success) {
      playCashRegister();
    }
  };

  const getUpgradeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio className="w-5 h-5 text-purple-400" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-purple-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-purple-400" />;
      default:
        return <Zap className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono select-none overflow-hidden">
      {/* Title Bar */}
      <div className="bg-purple-950 px-3 py-1.5 border-b border-purple-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-bold text-white">TOR_BLACK_MARKET_VENDORS.EXE - [Illicit Call Center Gear]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400">Available Funds:</span>
          <span className="text-xs font-bold text-emerald-400 tabular-nums">
            ${balance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Description Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 leading-relaxed">
        Invest your stolen scam earnings into dark web hardware, predictive SIP dialers, and anti-intrusion counter-measures to supercharge your conversion rates.
      </div>

      {/* Upgrades Grid */}
      <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto w-full">
        {upgrades.map((item) => {
          const canAfford = balance >= item.cost;
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded border flex flex-col justify-between transition-all ${
                item.purchased
                  ? 'bg-purple-950/20 border-purple-900/60 text-zinc-400'
                  : canAfford
                  ? 'bg-zinc-900 border-zinc-700 hover:border-purple-500'
                  : 'bg-zinc-950 border-zinc-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-purple-950/60 border border-purple-800">
                      {getUpgradeIcon(item.icon)}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-200 text-xs">{item.name}</div>
                      <div className="text-[10px] text-emerald-400 font-bold mt-0.5">{item.bonus}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 tabular-nums">
                    ${item.cost.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800">
                {item.purchased ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-purple-400 font-bold py-1.5 bg-purple-950/40 rounded border border-purple-800">
                    <Check className="w-3.5 h-3.5" />
                    <span>INSTALLED & ACTIVE</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`w-full py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'PURCHASE UPGRADE' : 'INSUFFICIENT FUNDS'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
