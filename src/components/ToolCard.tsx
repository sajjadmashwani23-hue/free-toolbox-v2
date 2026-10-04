import React from 'react';
import { 
  QrCode, 
  Minimize2, 
  Maximize2, 
  FileImage, 
  RefreshCw, 
  Layers, 
  FileSpreadsheet, 
  FilePlus, 
  FileText, 
  Code,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ToolDefinition } from '../types';

interface ToolCardProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  QrCode,
  Minimize2,
  Maximize2,
  FileImage,
  RefreshCw,
  Layers,
  FileSpreadsheet,
  FilePlus,
  FileText,
  Code
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onNavigate }) => {
  const IconComponent = ICON_MAP[tool.iconName] || FileText;

  return (
    <div
      onClick={() => onNavigate(`/${tool.slug}`)}
      className="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Popular glow badge */}
      {tool.popular && (
        <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>Popular</span>
        </div>
      )}

      <div>
        {/* Tool Icon */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 transition-all duration-200 shadow-sm">
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
          <span>{tool.title}</span>
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action link */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
        <span>Use Tool Free</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
