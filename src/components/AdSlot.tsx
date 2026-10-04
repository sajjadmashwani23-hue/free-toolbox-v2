import React, { useEffect, useState } from 'react';

export type AdPosition = 'top_banner' | 'in_content' | 'below_tool' | 'sidebar';
interface AdSlotProps { position: AdPosition; className?: string; }
const CLIENT_ID = (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID as string | undefined;
const SLOT_MAP: Record<AdPosition, string | undefined> = { top_banner: (import.meta as any).env?.VITE_ADSENSE_SLOT_TOP, in_content: (import.meta as any).env?.VITE_ADSENSE_SLOT_IN_CONTENT, below_tool: (import.meta as any).env?.VITE_ADSENSE_SLOT_BELOW_TOOL, sidebar: (import.meta as any).env?.VITE_ADSENSE_SLOT_SIDEBAR };
export const ADS_ENABLED = Boolean(CLIENT_ID);

export const AdSlot: React.FC<AdSlotProps> = ({ position, className = '' }) => {
  const slot = SLOT_MAP[position];
  const [consented, setConsented] = useState(false);
  useEffect(() => {
    const accepted = typeof window !== 'undefined' && localStorage.getItem('ftb_cookie_consent') === 'accepted';
    setConsented(accepted);
    if (accepted) loadAdSenseScript();
  }, []);
  useEffect(() => {
    if (!CLIENT_ID || !slot || !consented || !document.querySelector(`script[data-ftb-adsense]`)) return;
    try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch {}
  }, [slot, consented]);
  const minHeight = position === 'top_banner' ? 'min-h-[90px]' : position === 'sidebar' ? 'min-h-[250px]' : 'min-h-[250px]';
  if (CLIENT_ID && slot && consented) return <div className={`w-full flex items-center justify-center overflow-hidden ${minHeight} ${className}`} data-ad-position={position}>
    <ins className="adsbygoogle block w-full" style={{ minHeight: position === 'top_banner' ? 90 : 250 }} data-ad-client={CLIENT_ID} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
  </div>;
  return <div className={`w-full my-6 flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 text-xs ${minHeight} ${className}`} data-ad-position={position}>
    <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider font-semibold"><span>Advertisement</span><span className="w-1 h-1 rounded-full bg-slate-300" /><span>Sponsor Slot</span></div>
    <div className="mt-1 text-[11px] text-center">Responsive ad space — configure AdSense environment variables after approval.</div>
  </div>;
};

export function loadAdSenseScript() {
  if (typeof document === 'undefined' || !CLIENT_ID || document.querySelector('script[data-ftb-adsense]')) return;
  const script=document.createElement('script'); script.async=true; script.crossOrigin='anonymous'; script.dataset.ftbAdsense='true'; script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CLIENT_ID)}`; document.head.appendChild(script);
}
