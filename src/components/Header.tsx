import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  BookOpen, 
  ShieldCheck, 
  ChevronDown, 
  ExternalLink
} from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  // Close dropdown on outside click or navigation
  useEffect(() => {
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [currentPath]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    FreeTool<span className="text-blue-600 dark:text-blue-400">Box</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    100% Free
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                  Fast • Private • In-Browser
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  toolsDropdownOpen || (currentPath !== '/' && !currentPath.startsWith('/guides') && !['/about', '/privacy-policy', '/terms', '/contact'].includes(currentPath))
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Tools Directory</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                    Core Utilities (Zero Upload)
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                    {TOOLS.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onNavigate(`/${tool.slug}`);
                          setToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 flex items-start space-x-2.5 group transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 group-hover:scale-125 transition-transform" />
                        <div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {tool.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {tool.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('/guides')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath.startsWith('/guides')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Guides & Tutorials
            </button>

            <button
              onClick={() => onNavigate('/about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/about'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Why Browser-Only?
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2">
            {/* Instant Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
              title="Search tools (Press ⌘K or /)"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            All Free Tools
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onNavigate(`/${t.slug}`);
                  setMobileMenuOpen(false);
                }}
                className="text-left px-2.5 py-2 rounded-lg text-sm font-medium bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200"
              >
                {t.title}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
            <button
              onClick={() => {
                onNavigate('/guides');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Guides & Tutorials</span>
            </button>
            <button
              onClick={() => {
                onNavigate('/about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>About & Privacy Architecture</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
