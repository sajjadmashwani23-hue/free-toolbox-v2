import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { analytics } from '../utils/analytics';

interface ToolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const ToolSearchModal: React.FC<ToolSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredTools = TOOLS.filter((tool) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.categoryName.toLowerCase().includes(q) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const handleSelect = (slug: string) => {
    if (query) {
      analytics.track('search_used', { searchQuery: query, toolSlug: slug });
    }
    onNavigate(`/${slug}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex].slug);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search all free online tools (e.g. compress, QR, PDF, JSON)..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => (
              <div
                key={tool.id}
                onClick={() => handleSelect(tool.slug)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedIndex === idx
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    {tool.title.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">{tool.title}</span>
                      <span className="text-[10px] uppercase tracking-wide font-medium px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tool.categoryName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  {selectedIndex === idx && (
                    <span className="hidden sm:inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                      <span>Open</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm">No tools matching "{query}"</p>
              <p className="text-xs mt-1 text-slate-400">Try searching "image", "pdf", "qr", or "counter"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>100% Free Tools</span>
          </span>
        </div>
      </div>
    </div>
  );
};
