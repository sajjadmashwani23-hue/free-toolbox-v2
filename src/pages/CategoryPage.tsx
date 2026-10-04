import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { CATEGORY_META } from '../data/seoKeywords';
import { ToolCard } from '../components/ToolCard';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface CategoryPageProps { category: keyof typeof CATEGORY_META; onNavigate: (path: string) => void; }

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const meta = CATEGORY_META[category];
  const tools = TOOLS.filter((tool) => tool.category === category);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ name: meta.name }]} onNavigate={onNavigate} />
      <header className="max-w-3xl mx-auto text-center py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4"><Sparkles className="w-3.5 h-3.5" /> Free browser-based utilities</div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">{meta.name}</h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">{meta.description}</p>
      </header>
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Category benefits">
        {['No file upload required', 'Free to use in your browser', 'Fast local processing'].map((text) => <div key={text} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-emerald-500" /><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{text}</span></div>)}
      </section>
      <section aria-labelledby="category-tools">
        <div className="flex items-end justify-between mb-6"><div><h2 id="category-tools" className="text-2xl font-bold text-slate-900 dark:text-white">Free {meta.name}</h2><p className="text-sm text-slate-500 mt-1">Choose a tool to get started instantly.</p></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{tools.map((tool) => <ToolCard key={tool.id} tool={tool} onNavigate={onNavigate} />)}</div>
      </section>
      <section className="mt-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-7 sm:p-9">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">How to choose the right {meta.name.toLowerCase()} tool</h2>
        <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-400">FreeToolBox keeps these utilities focused on one task at a time. Select the tool that matches your file or text format, review its supported inputs and outputs, then process your data locally in the browser. Each tool page includes a step-by-step guide, practical explanations, frequently asked questions and related utilities so you can move to the next task without returning to a generic search page.</p>
        <button onClick={() => onNavigate('/')} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Explore all tools <ArrowRight className="w-4 h-4" /></button>
      </section>
    </div>
  );
};
