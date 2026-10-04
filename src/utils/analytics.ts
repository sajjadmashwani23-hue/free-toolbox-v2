/**
 * Privacy-friendly client-side analytics abstraction layer.
 * Tracks operational telemetry without collecting personal identification or IP addresses.
 */

export type AnalyticsEventType =
  | 'tool_open'
  | 'file_upload'
  | 'conversion_started'
  | 'conversion_completed'
  | 'download_clicked'
  | 'tool_error'
  | 'search_used'
  | 'theme_toggled';

export interface AnalyticsPayload {
  toolSlug?: string;
  fileType?: string;
  fileSize?: number;
  outputFormat?: string;
  searchQuery?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

class AnalyticsManager {
  private isEnabled: boolean = false;

  constructor() {
    // Check if user disabled telemetry in localStorage
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('ftb_cookie_consent');
      const stored = localStorage.getItem('ftb_analytics_consent');
      this.isEnabled = consent === 'accepted' && stored !== 'false';
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ftb_analytics_consent', enabled ? 'true' : 'false');
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public initGoogleAnalytics() {
    if (typeof window === 'undefined') return;
    const id = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID as string | undefined;
    if (!id || document.getElementById('ftb-ga-script')) return;
    const script = document.createElement('script');
    script.id = 'ftb-ga-script'; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function(){ (window as any).dataLayer.push(arguments); };
    (window as any).gtag('js', new Date()); (window as any).gtag('config', id, { anonymize_ip: true });
  }

  public track(event: AnalyticsEventType, payload: AnalyticsPayload = {}) {
    if (!this.isEnabled) return;

    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      ...payload,
    };

    // Dispatch a local event and bridge to GA4 when an approved measurement ID is configured.
    if (typeof window !== 'undefined') {
      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') { gtag('event', event, payload); }
      window.dispatchEvent(
        new CustomEvent('ftb_analytics_event', { detail: eventData })
      );
    }
  }
}

export const analytics = new AnalyticsManager();
