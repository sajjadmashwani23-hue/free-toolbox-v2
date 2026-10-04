import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { loadAdSenseScript } from './AdSlot';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ftb_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth UX
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ftb_cookie_consent', 'accepted');
    analytics.setEnabled(true);
    analytics.initGoogleAnalytics();
    loadAdSenseScript();
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('ftb_cookie_consent', 'declined');
    analytics.setEnabled(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside aria-label="Cookie and Privacy Consent" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Your Privacy is Respected
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            FreeToolBox operates completely in your browser. We never upload your files to remote servers. We use basic anonymous usage telemetry to keep tools free and fast.
          </p>
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Accept & Continue
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          aria-label="Close consent banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
