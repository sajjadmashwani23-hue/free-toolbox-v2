import React from 'react';
import { Wrench, Shield, Zap, Lock, Heart, FileText, CheckCircle2 } from 'lucide-react';
import { TOOLS } from '../data/toolsData';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const imageTools = TOOLS.filter((t) => t.category === 'image');
  const pdfTools = TOOLS.filter((t) => t.category === 'pdf');
  const textTools = TOOLS.filter((t) => t.category === 'text');
  const devTools = TOOLS.filter((t) => t.category === 'developer');

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      {/* Privacy Pledge Banner */}
      <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-blue-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Zero Server Uploads & Client-Side Privacy
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Whenever technically possible, your files are processed directly in your browser and are never uploaded to remote servers.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free Forever</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Account Required</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center space-x-2.5 text-left group mb-4"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                FreeTool<span className="text-blue-600 dark:text-blue-400">Box</span>
              </span>
            </button>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-sm leading-relaxed">
              Fast, simple, and free online tools to convert, compress, generate, calculate, and format files directly in your browser.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 dark:text-slate-500">
              <span>Built with modern Web APIs</span>
              <span>•</span>
              <span>High-speed client runtime</span>
            </div>
          </div>

          {/* Image Tools Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Image Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              {imageTools.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onNavigate(`/${t.slug}`)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
              <li className="text-xs text-slate-400 italic">More coming soon...</li>
            </ul>
          </div>

          {/* PDF & Doc Tools Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              PDF & Docs
            </h3>
            <ul className="space-y-2.5 text-sm">
              {pdfTools.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onNavigate(`/${t.slug}`)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
              {textTools.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onNavigate(`/${t.slug}`)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Tools Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Developer Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              {devTools.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onNavigate(`/${t.slug}`)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('/guides/how-to-format-json')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  JSON Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About FreeToolBox
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy-policy')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/cookie-policy')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/disclaimer')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Quick Links */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FreeToolBox. All rights reserved. Free online tools engineered for performance.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavigate('/guides')} className="hover:underline">
              All Guides
            </button>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Sitemap.xml
            </a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Robots.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
