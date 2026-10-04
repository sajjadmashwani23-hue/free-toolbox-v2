import React from 'react';
import { Search, Home, ArrowRight, HelpCircle } from 'lucide-react';
import { TOOLS } from '../data/toolsData';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate, onOpenSearch }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-8">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-2xl shadow-inner">
        404
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Tool or Page Not Found
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The requested address could not be located. You can search our directory or choose from the popular tools below.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </button>
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold"
        >
          <Search className="w-4 h-4" />
          <span>Search Tools</span>
        </button>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
          Try One of These Popular Free Tools
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {TOOLS.slice(0, 6).map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(`/${tool.slug}`)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {tool.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
