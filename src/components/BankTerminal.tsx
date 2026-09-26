import React, { useState } from 'react';
import { StolenLoot } from '../types/game';
import { CreditCard, Gift, DollarSign, CheckCircle2, ArrowRight, ShieldCheck, History } from 'lucide-react';
import { playCashRegister, playBeep } from '../utils/audio';

interface BankTerminalProps {
  balance: number;
  lootHistory: StolenLoot[];
  onProcessCard: (cardNum: string, cvv: string, expiry?: string) => { success: boolean; message: string; loot?: StolenLoot };
  onProcessGiftCard: (code: string) => { success: boolean; message: string; loot?: StolenLoot };
}

export const BankTerminal: React.FC<BankTerminalProps> = ({
  balance,
  lootHistory,
  onProcessCard,
  onProcessGiftCard,
}) => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'GIFTCARD' | 'HISTORY'>('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('08/28');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim() || !cvv.trim()) return;

    const result = onProcessCard(cardNumber.trim(), cvv.trim(), expiry.trim());
    if (result.success) {
      playCashRegister();
      setStatusMessage({ text: result.message, isError: false });
      setCardNumber('');
      setCvv('');
    } else {
      playBeep(250, 0.2);
      setStatusMessage({ text: result.message, isError: true });
    }
  };

  const handleGiftCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardCode.trim()) return;

    const result = onProcessGiftCard(giftCardCode.trim());
    if (result.success) {
      playCashRegister();
      setStatusMessage({ text: result.message, isError: false });
      setGiftCardCode('');
    } else {
      playBeep(250, 0.2);
      setStatusMessage({ text: result.message, isError: true });
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono select-none overflow-hidden">
      {/* Title bar */}
      <div className="bg-blue-950 px-3 py-1.5 border-b border-blue-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-bold text-white">MERCHANT_POS_TERMINAL.EXE - [Offshore Clearinghouse]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400">Total Liquidated:</span>
          <span className="text-xs font-bold text-emerald-400 tabular-nums">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-900 px-3 py-1 border-b border-zinc-800 flex gap-2 text-xs">
        <button
          onClick={() => {
            setActiveTab('CARD');
            setStatusMessage(null);
          }}
          className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
            activeTab === 'CARD' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3 h-3" />
          <span>Charge Stolen Card (/input_card)</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('GIFTCARD');
            setStatusMessage(null);
          }}
          className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
            activeTab === 'GIFTCARD' ? 'bg-amber-600 text-black font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Gift className="w-3 h-3" />
          <span>Redeem Gift Card (/input_giftcard)</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('HISTORY');
            setStatusMessage(null);
          }}
          className={`px-3 py-1 rounded flex items-center gap-1.5 transition-all ${
            activeTab === 'HISTORY' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <History className="w-3 h-3" />
          <span>Payout Ledger ({lootHistory.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto max-w-2xl mx-auto w-full">
        {statusMessage && (
          <div
            className={`p-3 rounded border mb-4 text-xs font-mono flex items-center gap-2 ${
              statusMessage.isError
                ? 'bg-red-950/60 border-red-700 text-red-300'
                : 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
            }`}
          >
            {statusMessage.isError ? (
              <span className="text-red-400 font-bold">✖ ERROR:</span>
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* TAB 1: CREDIT CARD CHARGING */}
        {activeTab === 'CARD' && (
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="font-bold text-blue-400 text-sm">OFFSHORE CARD PROCESSOR (STRIPE CLONE)</span>
              <span className="text-[10px] text-zinc-500">256-BIT ENCRYPTION BYPASS</span>
            </div>
            <p className="text-xs text-zinc-400">
              Enter credit card numbers obtained from caller. Terminal will test Luhn algorithm, simulate 3D-Secure bypass, and deposit funds to your balance.
            </p>

            <form onSubmit={handleCardSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                  16-Digit Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4112 9021 3499 8120"
                  className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-emerald-400 font-mono tracking-wider focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    CVV / CVC (3-4 Digits)
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="719"
                    maxLength={4}
                    className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-emerald-400 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    Expiration (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="11/27"
                    className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-emerald-400 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-950"
              >
                <DollarSign className="w-4 h-4" />
                <span>AUTHORIZE & LIQUIDATE CARD</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: GIFT CARD REDEMPTION */}
        {activeTab === 'GIFTCARD' && (
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="font-bold text-amber-400 text-sm">GIFT CARD LAUNDERING PORTAL</span>
              <span className="text-[10px] text-zinc-500">TARGET / APPLE / STEAM</span>
            </div>
            <p className="text-xs text-zinc-400">
              Input gift card claim codes read by victim. Codes are immediately redeemed via automated Chinese P2P exchange into cold hard cash ($500 - $1,500 each).
            </p>

            <form onSubmit={handleGiftCardSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                  Gift Card Claim Code (Target / Apple / Steam)
                </label>
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  placeholder="TARGET-8921-4401-9923"
                  className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-amber-300 font-mono tracking-widest focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-950"
              >
                <Gift className="w-4 h-4" />
                <span>LIQUIDATE GIFT CARD VOUCHER</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: TRANSACTION HISTORY */}
        {activeTab === 'HISTORY' && (
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="font-bold text-zinc-300 text-sm">PAYOUT CLEARING LEDGER</span>
              <span className="text-xs text-emerald-400 font-bold tabular-nums">
                {lootHistory.length} Transactions
              </span>
            </div>

            {lootHistory.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No stolen funds processed yet. Convince callers to reveal cards or gift cards!
              </div>
            ) : (
              <div className="space-y-2">
                {lootHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-zinc-950 border border-zinc-800 rounded flex justify-between items-center text-xs"
                  >
                    <div>
                      <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <span>{item.type === 'CREDIT_CARD' ? '💳 VISA/MC' : item.type === 'GIFT_CARD' ? '🎁 GIFT CARD' : '⚡ CRYPTO WIRE'}</span>
                        <span className="text-zinc-500">·</span>
                        <span className="text-zinc-400">{item.victimName}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                        {item.details} · {item.timestamp}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400 tabular-nums">
                        +${item.value.toLocaleString()}
                      </span>
                      <div className="text-[9px] text-emerald-500/80 font-bold">SETTLED</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
