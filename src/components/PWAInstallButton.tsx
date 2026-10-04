import React, { useState } from 'react';
import { Download, Share, X, Check, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105 ${className}`}
        title="Install FreeToolBox app for fast offline access"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition-colors ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Install on iOS</span>
          <span className="sm:hidden">Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Install on iPhone or iPad
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Add FreeToolBox to your home screen to use all converters, compressors, and tools offline anytime:
              </p>

              <ol className="mt-4 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Tap the <strong className="text-blue-600">Share</strong> icon in the Safari navigation toolbar.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Scroll down and select <strong className="text-slate-900 dark:text-white">Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Tap <strong className="text-blue-600">Add</strong> in the top-right corner to finish.</span>
                </li>
              </ol>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
