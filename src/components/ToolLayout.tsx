import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  FileCheck, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Zap,
  Wifi
} from 'lucide-react';
import { ToolDefinition } from '../types';
import { Breadcrumbs } from './Breadcrumbs';
import { AdSlot } from './AdSlot';
import { ToolCard } from './ToolCard';
import { TOOLS } from '../data/toolsData';
import { ToolSeoContent } from './ToolSeoContent';
import { TOOL_KEYWORDS } from '../data/seoKeywords';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const relatedTools = TOOLS.filter((t) => tool.relatedToolSlugs.includes(t.slug));

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { name: tool.categoryName, path: `/tools/${({image:'image-tools',pdf:'pdf-tools',text:'text-tools',developer:'developer-tools',calculator:'calculator-tools'} as Record<string,string>)[tool.category]}` },
          { name: tool.title },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header H1 and Short Intro */}
      <div className="mt-4 mb-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span>100% Free Client-Side Tool</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>Offline-Ready (PWA Cached)</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {tool.h1}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {tool.shortIntro}
        </p>
        {TOOL_KEYWORDS[tool.slug] && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Built for: {TOOL_KEYWORDS[tool.slug].intent}</p>
        )}
      </div>

      {/* Top Banner AdSlot */}
      <AdSlot position="top_banner" className="mb-8" />

      {/* Primary Interactive Tool Container */}
      <section aria-label={tool.title} className="mb-12">
        {children}
      </section>

      {/* Privacy Callout Banner */}
      <div className="mb-14 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 border border-blue-200/60 dark:border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Strict Local Browser Processing Guarantee
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Your files and sensitive text remain inside your browser RAM. They are never sent to a cloud database or remote queue.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/privacy-policy')}
          className="shrink-0 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
        >
          View Privacy Policy
        </button>
      </div>

      {/* Step-by-Step How-To Section */}
      <section className="mb-14">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            How to Use the {tool.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Follow these simple steps for quick, seamless results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tool.howToSteps.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                {step.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features & Supported Formats Grid */}
      <section className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Features List */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Key Tool Features</span>
          </h3>
          <ul className="space-y-3">
            {tool.featuresList.map((feat, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supported Formats Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            <span>Supported Specifications</span>
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Accepted Inputs:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {tool.supportedFormats.input.map((inp) => (
                  <span key={inp} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs">
                    {inp}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Generated Outputs:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {tool.supportedFormats.output.map((out) => (
                  <span key={out} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-xs border border-blue-200/50 dark:border-blue-900/50">
                    {out}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              Files are converted at original native DPI with zero arbitrary downsampling unless configured by the user.
            </div>
          </div>
        </div>
      </section>

      {/* In-depth Educational & Technical Insights */}
      <section className="mb-14 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Deep Dive</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Understanding {tool.title}: Technical & Practical Overview
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {tool.educationalContent.overview}
          </p>

          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
            Common Real-World Use Cases
          </h3>
          <ul className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
            {tool.educationalContent.useCases.map((uc, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{uc}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-700 dark:text-slate-300">Under the Hood: </span>
            {tool.educationalContent.technicalDetails}
          </div>
        </div>
      </section>

      {/* In-Content AdSlot */}
      <AdSlot position="in_content" className="mb-14" />

      {/* Long-form SEO content */}
      <ToolSeoContent tool={tool} />

      {/* Frequently Asked Questions (FAQ) */}
      <section className="mb-14">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Everything you need to know about using {tool.title} safely and efficiently.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {tool.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 flex items-center justify-between font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Tools Grid */}
      {relatedTools.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Related Free Tools
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complementary utilities you might find useful
              </p>
            </div>
            <button
              onClick={() => onNavigate('/')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
            >
              <span>Explore all tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedTools.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom AdSlot */}
      <AdSlot position="below_tool" />
    </div>
  );
};
