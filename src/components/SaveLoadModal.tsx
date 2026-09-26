import React, { useState } from 'react';
import { Save, Copy, Check, Upload, X } from 'lucide-react';
import { playBeep } from '../utils/audio';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveCode: string;
  onLoadCode: (code: string) => boolean;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  saveCode,
  onLoadCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [loadInput, setLoadInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(saveCode);
    setCopied(true);
    playBeep(800, 0.1);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loadInput.trim()) return;

    const ok = onLoadCode(loadInput.trim());
    if (ok) {
      playBeep(900, 0.15);
      setSuccessMsg('Game state restored successfully!');
      setTimeout(() => onClose(), 1200);
    } else {
      playBeep(250, 0.2);
      setErrorMsg('Invalid save code format. Please verify your string.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-lg bg-zinc-950 border-2 border-emerald-500/60 rounded shadow-2xl text-zinc-100 overflow-hidden">
        {/* Header */}
        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">SAVE_STATE_MANAGER.SH</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* Export / Save Section */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded space-y-2">
            <div className="font-bold text-emerald-400 flex items-center justify-between">
              <span>CURRENT SAVE STATE STRING:</span>
              <span className="text-[10px] text-zinc-400">BASE64 ENCRYPTED</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Copy this save state string to keep your bank balance, upgrades, and syndicate progression:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={saveCode}
                className="flex-1 bg-black border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-emerald-300 font-mono select-all truncate"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
          </div>

          {/* Import / Load Section */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded space-y-2">
            <div className="font-bold text-amber-400">LOAD EXISTING SAVE STATE:</div>
            <form onSubmit={handleLoad} className="space-y-2">
              <input
                type="text"
                value={loadInput}
                onChange={(e) => setLoadInput(e.target.value)}
                placeholder="Paste code starting with CCT-SAVE-..."
                className="w-full bg-black border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>RESTORE SAVE CODE</span>
              </button>
            </form>

            {errorMsg && <div className="text-red-400 text-[11px]">✖ {errorMsg}</div>}
            {successMsg && <div className="text-emerald-400 text-[11px]">✓ {successMsg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
