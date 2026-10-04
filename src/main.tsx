import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { analytics } from './utils/analytics';

// Register Service Worker to cache tool assets and enable offline conversions
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('FreeToolBox update available');
  },
  onOfflineReady() {
    console.log('FreeToolBox ready to perform conversions and formatting offline');
  },
});

// Returning visitors who already accepted the cookie prompt: start GA4 (no-op without VITE_GA_MEASUREMENT_ID).
if (analytics.getIsEnabled()) analytics.initGoogleAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

