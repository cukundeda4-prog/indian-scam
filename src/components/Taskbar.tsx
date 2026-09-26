import React, { useState } from 'react';
import { WindowId } from '../types/game';
import { Phone, Monitor, CreditCard, ShoppingCart, Bitcoin, Save, Volume2, VolumeX, Terminal, Shield } from 'lucide-react';
import { playBeep } from '../utils/audio';

interface TaskbarProps {
  activeWindow: WindowId;
  onSelectWindow: (w: WindowId) => void;
  timeStr: string;
  onOpenSaveModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isCallActive: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  activeWindow,
  onSelectWindow,
  timeStr,
  onOpenSaveModal,
  isMuted,
  onToggleMute,
  isCallActive,
}) => {
  const [startOpen, setStartOpen] = useState(false);

  const apps: { id: WindowId; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'DIALER', label: 'Phone Dialer', icon: <Phone className="w-3.5 h-3.5 text-emerald-400" />, shortcut: '[1]' },
    { id: 'ANYDESK', label: 'AnyDesk Remote', icon: <Monitor className="w-3.5 h-3.5 text-red-400" />, shortcut: '[2]' },
    { id: 'BANK_TERMINAL', label: 'Bank Terminal', icon: <CreditCard className="w-3.5 h-3.5 text-blue-400" />, shortcut: '[3]' },
    { id: 'BLACK_MARKET', label: 'Black Market', icon: <ShoppingCart className="w-3.5 h-3.5 text-purple-400" />, shortcut: '[4]' },
    { id: 'DARK_WEB', label: 'Dark Web Wallet', icon: <Bitcoin className="w-3.5 h-3.5 text-amber-400" />, shortcut: '[5]' },
  ];

  return (
    <div className="relative">
      {/* Start Menu Popup */}
      {startOpen && (
        <div className="absolute bottom-11 left-1 w-64 bg-zinc-900 border-2 border-zinc-700 shadow-2xl rounded text-xs font-mono z-50 overflow-hidden select-none">
          <div className="bg-gradient-to-r from-emerald-800 to-zinc-900 p-2.5 flex items-center gap-2 border-b border-zinc-700">
            <Terminal className="w-5 h-5 text-emerald-300" />
            <div>
              <div className="font-bold text-white text-xs">OPERATOR OS v2.4</div>
              <div className="text-[10px] text-emerald-200">Call Center Tycoon</div>
            </div>
          </div>
          <div className="p-1.5 space-y-1">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  playBeep(500, 0.05);
                  onSelectWindow(app.id);
                  setStartOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  {app.icon}
                  <span>{app.label}</span>
                </div>
                <span className="text-[10px] text-zinc-500">{app.shortcut}</span>
              </button>
            ))}
            <div className="pt-1 border-t border-zinc-800">
              <button
                onClick={() => {
                  setStartOpen(false);
                  onOpenSaveModal();
                }}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-zinc-800 text-amber-300 transition-colors"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save / Load Game (/save)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar Bar */}
      <div className="h-10 bg-zinc-950 border-t-2 border-zinc-800 px-2 flex items-center justify-between font-mono text-xs select-none">
        {/* Start Button & Running Apps */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => {
              playBeep(600, 0.05);
              setStartOpen(!startOpen);
            }}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all border ${
              startOpen
                ? 'bg-emerald-600 text-black border-emerald-400 shadow-md'
                : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>START</span>
          </button>

          <div className="h-5 w-px bg-zinc-800 mx-1" />

          {apps.map((app) => {
            const isActive = activeWindow === app.id;
            return (
              <button
                key={app.id}
                onClick={() => {
                  playBeep(450, 0.05);
                  onSelectWindow(app.id);
                }}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 border transition-all text-[11px] whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 border-emerald-500/80 text-white font-bold shadow-inner'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                {app.icon}
                <span>{app.label}</span>
                {app.id === 'DIALER' && isCallActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* System Tray (Clock, Sound, Save) */}
        <div className="flex items-center gap-2.5 text-zinc-400 text-xs shrink-0 pl-2">
          <button
            onClick={onOpenSaveModal}
            className="flex items-center gap-1 text-[11px] hover:text-amber-400 px-1.5 py-0.5 rounded hover:bg-zinc-900"
            title="Save / Load State (/save, /load)"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={onToggleMute}
            className="hover:text-white p-1 rounded hover:bg-zinc-900"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <div className="px-2 py-0.5 bg-black rounded border border-zinc-800 text-emerald-400 font-bold tabular-nums">
            {timeStr}
          </div>
        </div>
      </div>
    </div>
  );
};
