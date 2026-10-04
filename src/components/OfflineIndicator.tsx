import React, { useState } from 'react';
import { WifiOff, CheckCircle2, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  // If online or user temporarily dismissed, don't show
  if (isOnline || dismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Offline Mode Notice"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 p-3.5 bg-slate-900/95 text-white dark:bg-slate-800/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Offline Mode Active
            </h4>
            <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Tools Ready</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Service worker cached your utilities. You can continue compressing images, generating QR codes, merging PDFs, and formatting JSON offline!
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Dismiss offline banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
