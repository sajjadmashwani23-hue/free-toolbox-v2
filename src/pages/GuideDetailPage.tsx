import React, { useEffect } from 'react';
import { Clock, Calendar, ArrowRight, Wrench, ShieldCheck, Share2 } from 'lucide-react';
import { GuideArticle } from '../types';
import { TOOLS } from '../data/toolsData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdSlot } from '../components/AdSlot';
import { updateSEOMeta, generateGuideSchema } from '../utils/seo';

interface GuideDetailPageProps {
  guide: GuideArticle;
  onNavigate: (path: string) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ guide, onNavigate }) => {
  const matchingTool = TOOLS.find((t) => t.slug === guide.relatedToolSlug);

  useEffect(() => {
    updateSEOMeta({
      title: `${guide.title} | FreeToolBox Guides`,
      description: guide.description,
      canonicalPath: `/guides/${guide.slug}`,
      schema: generateGuideSchema(guide),
    });
  }, [guide]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: 'Guides', path: '/guides' },
          { name: guide.title },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header Info */}
      <div className="mt-4 mb-8">
        <div className="flex items-center space-x-3 text-xs text-slate-500 mb-3">
          <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
            {guide.category}
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{guide.readTime}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated {guide.publishedDate}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {guide.description}
        </p>
      </div>

      <AdSlot position="top_banner" className="mb-8" />

      {/* Matching Tool CTA Banner */}
      {matchingTool && (
        <div className="mb-10 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                Recommended Interactive Tool
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Use our free {matchingTool.title} online
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate(`/${matchingTool.slug}`)}
            className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-transform hover:scale-105"
          >
            <span>Open Tool Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Guide Body Content */}
      <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8 leading-relaxed">
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          {guide.content.intro}
        </p>

        {guide.content.sections.map((section, idx) => (
          <section key={idx} className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {section.heading}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              {section.body}
            </p>

            {section.tips && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 my-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Best Practice Tips:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {section.tips.map((tip, tIdx) => (
                    <li key={tIdx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Conclusion & Next Steps
          </h3>
          <p className="text-sm sm:text-base">
            {guide.content.conclusion}
          </p>
        </div>
      </article>

      <AdSlot position="below_tool" className="mt-12" />
    </div>
  );
};
