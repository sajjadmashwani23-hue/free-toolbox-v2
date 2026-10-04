import React from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { GUIDES } from '../data/guidesData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdSlot } from '../components/AdSlot';

interface GuidesPageProps {
  onNavigate: (path: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ name: 'Guides & Resources' }]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Educational Technical Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Guides, Tutorials & Technical References
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          In-depth tutorials answering real questions about file compression, QR code generation, document merging, modern image formats, and developer workflows.
        </p>
      </div>

      <AdSlot position="top_banner" />

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDES.map((guide) => (
          <article
            key={guide.slug}
            onClick={() => onNavigate(`/guides/${guide.slug}`)}
            className="group flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                  {guide.category}
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.readTime}</span>
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                {guide.title}
              </h2>

              <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {guide.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Read Full Tutorial</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

      <AdSlot position="below_tool" />
    </div>
  );
};
