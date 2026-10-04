import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 dark:text-slate-400 py-3">
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li className="text-slate-300 dark:text-slate-600">
                <ChevronRight className="w-3 h-3" />
              </li>
              <li>
                {item.path && !isLast ? (
                  <button
                    onClick={() => onNavigate(item.path!)}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
                  >
                    {item.name}
                  </button>
                ) : (
                  <span className="font-semibold text-slate-800 dark:text-slate-200" aria-current={isLast ? 'page' : undefined}>
                    {item.name}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
