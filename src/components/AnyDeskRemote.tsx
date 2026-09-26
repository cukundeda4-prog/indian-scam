import React, { useState } from 'react';
import { ActiveCall } from '../types/game';
import { Monitor, Terminal, Globe, Lock, Shield, AlertTriangle, Eye, EyeOff, CheckCircle, RefreshCw } from 'lucide-react';
import { playBeep, playKeyboardClick } from '../utils/audio';

interface AnyDeskRemoteProps {
  currentCall: ActiveCall | null;
  onRunTreeCommand: () => void;
  onLockSyskey: () => void;
  onInspectElementRefund: (amount: number) => void;
  onConnectRemote: () => void;
}

export const AnyDeskRemote: React.FC<AnyDeskRemoteProps> = ({
  currentCall,
  onRunTreeCommand,
  onLockSyskey,
  onInspectElementRefund,
  onConnectRemote,
}) => {
  const [activeTab, setActiveTab] = useState<'DESKTOP' | 'CMD' | 'BANK' | 'EVENT_VIEWER'>('BANK');
  const [cmdOutput, setCmdOutput] = useState<string[]>([
    'Microsoft Windows [Version 10.0.19045.3803]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'C:\\Users\\Victim> _',
  ]);
  const [isTreeRunning, setIsTreeRunning] = useState(false);
  const [isSyskeyLocked, setIsSyskeyLocked] = useState(false);
  const [isScreenBlackedOut, setIsScreenBlackedOut] = useState(false);
  const [fakeBalance, setFakeBalance] = useState<number | null>(null);
  const [inspectAmount, setInspectAmount] = useState('5000');

  const isConnected = currentCall?.anydeskConnected ?? false;
  const victim = currentCall?.victim;

  const handleRunTree = () => {
    if (isTreeRunning) return;
    setIsTreeRunning(true);
    playKeyboardClick();

    const fakeTreeLines = [
      'C:\\Users\\Victim> tree /f',
      'Folder PATH listing',
      'Volume serial number is 4492-8812',
      'C:.',
      '├── Windows',
      '│   ├── System32',
      '│   │   ├── drivers',
      '│   │   │   └── [INFECTED] zeus_trojan_core.sys',
      '│   │   └── [CORRUPT] ntoskrnl.exe',
      '├── Users',
      '│   └── AppData',
      '│       ├── [WARNING] keylogger_russian_apt28.dll',
      '│       └── [ALERT] unauthorized_btc_miner.bin',
      '...',
      '>>> 347 CRITICAL VIRUS INFECTIONS FOUND ON LOCAL DRIVE <<<',
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < fakeTreeLines.length) {
        setCmdOutput((prev) => [...prev, fakeTreeLines[step]]);
        playBeep(400 + step * 30, 0.03);
        step++;
      } else {
        clearInterval(interval);
        setIsTreeRunning(false);
        onRunTreeCommand();
      }
    }, 120);
  };

  const handleLockSyskey = () => {
    setIsSyskeyLocked(true);
    playBeep(250, 0.3);
    setCmdOutput((prev) => [
      ...prev,
      'C:\\Windows\\System32> syskey.exe /lock',
      'SYSTEM STARTUP PASSWORD ENABLED.',
      'PC IS NOW LOCKED WITH MASTER OPERATOR ENCRYPTION KEY.',
    ]);
    onLockSyskey();
  };

  const handleApplyInspectRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(inspectAmount) || 5000;
    const current = victim?.bankBalance || 40000;
    setFakeBalance(current + parsed);
    playBeep(900, 0.1);
    onInspectElementRefund(parsed);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono select-none overflow-hidden">
      {/* Remote Window Title Bar */}
      <div className="bg-red-900/80 px-3 py-1.5 border-b border-red-700 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Monitor className="w-3.5 h-3.5 text-red-200" />
          <span className="font-bold text-white">
            ANYDESK v8.1 - REMOTE WORKSTATION
            {isConnected ? ` [CONNECTED: ${currentCall?.anydeskCode || '881-204-912'}]` : ' [OFFLINE]'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <button
              onClick={() => setIsScreenBlackedOut(!isScreenBlackedOut)}
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 hover:border-red-400"
            >
              {isScreenBlackedOut ? <Eye className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3 text-zinc-400" />}
              <span>{isScreenBlackedOut ? 'Unblank Screen' : 'Blank Victim Monitor'}</span>
            </button>
          )}
          <span className="text-[11px] text-red-200 px-2 py-0.5 rounded bg-red-950">
            {isConnected ? 'LIVE STREAM (24 FPS)' : 'NO SESSION'}
          </span>
        </div>
      </div>

      {!isConnected ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-500 space-y-3">
          <Monitor className="w-12 h-12 text-zinc-700" />
          <div className="font-bold text-zinc-300 text-sm">NO ACTIVE ANYDESK SESSION</div>
          <p className="max-w-md text-xs text-zinc-400 leading-relaxed">
            {currentCall
              ? `You are on the phone with ${currentCall.victim.name}. Convince them to open AnyDesk or send the link to establish remote desktop access.`
              : 'Start a call with a victim first, then request remote control to inspect their bank account and run diagnostic scans.'}
          </p>
          {currentCall && (
            <button
              onClick={onConnectRemote}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-xs transition-colors shadow-md shadow-red-950"
            >
              REQUEST REMOTE ACCESS (/connect)
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900">
          {/* Sub Navigation Bar inside Remote Session */}
          <div className="bg-zinc-800 px-3 py-1.5 border-b border-zinc-700 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] mr-1">REMOTE APPS:</span>
              <button
                onClick={() => setActiveTab('BANK')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                  activeTab === 'BANK' ? 'bg-blue-600 text-white font-bold' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Victim Bank Portal</span>
              </button>
              <button
                onClick={() => setActiveTab('CMD')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                  activeTab === 'CMD' ? 'bg-black text-emerald-400 font-bold border border-emerald-600' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>CMD Prompt (Tree/Syskey)</span>
              </button>
              <button
                onClick={() => setActiveTab('EVENT_VIEWER')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                  activeTab === 'EVENT_VIEWER' ? 'bg-amber-600 text-white font-bold' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Event Viewer (Fake Errors)</span>
              </button>
            </div>
            <div className="text-[11px] text-zinc-400">
              User: <span className="text-zinc-200 font-bold">{victim?.name}</span>
            </div>
          </div>

          {/* Victim Screen Display Container */}
          <div className="flex-1 relative p-3 overflow-y-auto bg-slate-950 flex flex-col items-center justify-center">
            {/* Screen Blanking Overlay simulation */}
            {isScreenBlackedOut && (
              <div className="absolute inset-0 bg-black/95 z-30 flex flex-col items-center justify-center text-center p-4">
                <Shield className="w-10 h-10 text-amber-500 mb-2 animate-pulse" />
                <div className="text-amber-400 font-bold text-sm">VICTIM MONITOR IS BLACKED OUT</div>
                <div className="text-zinc-500 text-xs mt-1">Victim sees a black screen with "Windows Updating: 27%... Please wait."</div>
              </div>
            )}

            {/* TAB 1: VICTIM BANK PORTAL (INSPECT ELEMENT OVERPAYMENT SCAM) */}
            {activeTab === 'BANK' && (
              <div className="w-full max-w-2xl bg-white text-slate-800 rounded border border-slate-300 shadow-xl overflow-hidden font-sans">
                {/* Browser address bar */}
                <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 flex items-center gap-2 text-xs">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 text-[11px] truncate flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-emerald-600" />
                    <span>https://secure.chase-onlinebanking-customer.com/portal/my-accounts</span>
                  </div>
                </div>

                {/* Bank UI */}
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <div>
                      <div className="text-base font-bold text-blue-900">FIRST NATIONAL HORIZON BANK</div>
                      <div className="text-xs text-slate-500">Welcome, {victim?.name}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      ACCOUNT VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <div className="text-xs text-slate-500 font-medium">TOTAL CHECKING BALANCE</div>
                      <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">
                        ${(fakeBalance ?? (victim?.bankBalance || 42350)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      {fakeBalance !== null && (
                        <div className="text-[10px] text-emerald-600 font-bold mt-1">
                          +${parseFloat(inspectAmount).toLocaleString()} PENDING REFUND DEPOSIT
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <div className="text-xs text-slate-500 font-medium">SAVINGS / CD VAULT</div>
                      <div className="text-xl font-bold text-slate-700 tabular-nums mt-1">$18,400.00</div>
                    </div>
                  </div>

                  {/* Scammer Inspect Element Tool inside the Bank portal */}
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded font-mono text-xs space-y-2">
                    <div className="font-bold text-amber-900 flex items-center justify-between">
                      <span>🛠 INSPECT ELEMENT REFUND MODIFIER</span>
                      <span className="text-[10px] text-amber-700">F12 DEVTOOLS TRICK</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      Change the displayed balance on the victim's screen to fake an "accidental over-refund" of $5,000 instead of $50, then demand they repay the difference in gift cards!
                    </p>
                    <form onSubmit={handleApplyInspectRefund} className="flex gap-2 pt-1">
                      <input
                        type="number"
                        value={inspectAmount}
                        onChange={(e) => setInspectAmount(e.target.value)}
                        placeholder="5000"
                        className="w-32 px-2 py-1 bg-white border border-amber-400 rounded text-slate-900 text-xs font-bold"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-xs transition-colors"
                      >
                        ALTER HTML BALANCE (+20 Trust)
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CMD PROMPT (TREE / SYSKEY) */}
            {activeTab === 'CMD' && (
              <div className="w-full max-w-2xl bg-black text-emerald-400 rounded border border-zinc-700 p-3 font-mono text-xs flex flex-col h-80 shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                  <span>Command Prompt - Administrator: cmd.exe</span>
                  <span>PID: 4920</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-0.5 py-2 font-mono text-[11px]">
                  {cmdOutput.map((line, idx) => (
                    <div key={idx} className={line.includes('INFECTED') || line.includes('CRITICAL') ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {line}
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-zinc-800 flex gap-2">
                  <button
                    onClick={handleRunTree}
                    disabled={isTreeRunning}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold rounded text-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTreeRunning ? 'animate-spin' : ''}`} />
                    <span>Run "tree /f" Fake Virus Scan (+15 Trust)</span>
                  </button>
                  <button
                    onClick={handleLockSyskey}
                    disabled={isSyskeyLocked}
                    className="px-3 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded text-xs flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isSyskeyLocked ? 'PC Locked (Syskey Active)' : 'Run "syskey" Lockout'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: EVENT VIEWER */}
            {activeTab === 'EVENT_VIEWER' && (
              <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded p-4 text-xs font-mono space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="font-bold text-amber-400">EVENT VIEWER - CRITICAL SYSTEM LOGS</span>
                  <span className="text-[10px] text-zinc-400">Event ID: 4625 (Trojan.Zeus)</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 bg-red-950/40 border border-red-800 rounded text-red-300">
                    ⚠ [ERROR 0x80070005]: Foreign connection attempt established to Russian Gateway 194.26.29.112:8080.
                  </div>
                  <div className="p-2 bg-red-950/40 border border-red-800 rounded text-red-300">
                    ⚠ [CRITICAL]: Banking certificates corrupted in %SYSTEMROOT%\\System32\\certmgr.msc.
                  </div>
                  <div className="p-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-400">
                    ℹ [INFO]: AnyDesk Session active with authorized remote technician.
                  </div>
                </div>
                <button
                  onClick={() => {
                    playBeep(650, 0.1);
                    onRunTreeCommand();
                  }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-xs transition-colors"
                >
                  Show Errors to Victim on Phone (+10 Trust, +5 Panic)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
