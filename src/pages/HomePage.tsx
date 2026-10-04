import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  DownloadCloud, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Lock, 
  Globe2,
  FileCheck2,
  HelpCircle,
  ChevronDown,
  MapPin,
  Globe
} from 'lucide-react';
import { TOOLS, FUTURE_TOOL_CATEGORIES } from '../data/toolsData';
import { ToolCard } from '../components/ToolCard';
import { AdSlot } from '../components/AdSlot';
import { ToolCategory } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

const CATEGORY_TABS: { id: 'all' | ToolCategory; label: string }[] = [
  { id: 'all', label: 'All Tools (10)' },
  { id: 'image', label: 'Image Tools' },
  { id: 'pdf', label: 'PDF Tools' },
  { id: 'text', label: 'Text Tools' },
  { id: 'developer', label: 'Developer Tools' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ToolCategory>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredTools = selectedCategory === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === selectedCategory);

  const popularTools = TOOLS.filter((t) => t.popular);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-14 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-blue-50/50 via-white to-transparent dark:from-blue-950/20 dark:via-slate-900/40 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% In-Browser Privacy • Zero Server File Uploads</span>
          </div>

          {/* Primary H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Free Online Tools <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Fast, Private & Easy to Use
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Use fast, simple, and free online tools to convert, compress, generate, calculate, and format files and data directly in your browser.
          </p>

          {/* Search Trigger Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div
              onClick={onOpenSearch}
              className="group flex items-center justify-between p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-xl shadow-slate-200/40 dark:shadow-none cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center space-x-3 px-3 py-1 flex-1">
                <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-sm sm:text-base text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 text-left">
                  Search for a free tool (e.g. compress image, QR code, PDF, JSON)...
                </span>
              </div>
              <button
                className="px-4 py-2 sm:py-2.5 bg-blue-600 group-hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
              >
                <span>Find Tool</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Keyword Pills */}
            <div className="mt-3 flex items-center justify-center flex-wrap gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Popular:</span>
              {[
                { name: 'Compress Image', slug: 'image-compressor' },
                { name: 'QR Code', slug: 'qr-code-generator' },
                { name: 'Merge PDF', slug: 'merge-pdf' },
                { name: 'Image to PDF', slug: 'image-to-pdf' },
                { name: 'JSON Prettify', slug: 'json-formatter' },
              ].map((p) => (
                <button
                  key={p.slug}
                  onClick={() => onNavigate(`/${p.slug}`)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Key Value Prop Badges */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Instant Speed</div>
                <div className="text-[11px] text-slate-500">Zero network queue lag</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Total Privacy</div>
                <div className="text-[11px] text-slate-500">Files stay on your machine</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 shrink-0">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Free Forever</div>
                <div className="text-[11px] text-slate-500">No account or credit card</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Browser-Powered</div>
                <div className="text-[11px] text-slate-500">Native WebAssembly & APIs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner AdSlot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot position="top_banner" />
      </div>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Trending Worldwide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Popular Free Tools
            </h2>
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>View All 10 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Complete Tools Directory with Filter Tabs */}
      <section id="tools-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            All Free Tools
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Browse our complete collection of fast, private utilities. Every tool runs 100% locally in your browser.
          </p>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Mid-Page AdSlot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot position="in_content" />
      </div>

      {/* Architecture & Future Roadmap Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400">
              Scalable Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-4">
              Designed to Grow: 50+ In-Browser Utilities Coming Soon
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-8">
              FreeToolBox is structured to house dozens of utilities across image optimization, PDF management, text analytics, developer parsing, and unit calculations. Every addition strictly follows our zero-paid-API, zero-file-upload privacy architecture.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {FUTURE_TOOL_CATEGORIES.map((cat) => (
                <div key={cat.category} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <h3 className="text-sm font-bold text-blue-300 mb-2">{cat.category}</h3>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {cat.tools.slice(0, 4).map((toolName, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span className="truncate">{toolName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* In-Depth Homepage SEO & Educational Content (800-1200 words) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Browser-Based Online Tools Are the Future of the Web
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
              How client-side computation, HTML5 Canvas, WebAssembly, and local execution are replacing insecure, ad-bloated legacy utilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                1. The Death of Server Uploads & Privacy Risks
              </h3>
              <p>
                For over two decades, using an online file converter or image compressor meant uploading your personal photographs, confidential PDF contracts, financial statements, and proprietary code to unknown remote servers. Those legacy websites saved files to storage buckets, often leaving them accessible via public URLs or retaining them for advertising targeting.
              </p>
              <p className="mt-2">
                <strong>FreeToolBox fundamentally inverts this model.</strong> Thanks to advancements in modern web browsers (Chrome, Safari, Firefox, and Edge), client devices now have massive processing power. By leveraging HTML5 Canvas, JavaScript ArrayBuffers, and WebAssembly, our tools process your images, PDFs, and text directly in your computer or phone’s memory.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                2. Instantaneous Zero-Queue Processing
              </h3>
              <p>
                Server-based conversion sites suffer from network latency and traffic throttling. When thousands of users upload files simultaneously, server queues choke, forcing visitors to wait minutes or pay for "priority conversion" tiers.
              </p>
              <p className="mt-2">
                Because FreeToolBox runs locally on your device, there is zero queue. An image that would take 15 seconds to upload, process, and re-download over a 4G connection is compressed in less than 200 milliseconds inside your browser tab.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-sm leading-relaxed">
            <h3 className="text-base font-bold text-blue-900 dark:text-blue-200 mb-2">
              The Zero-Paid-API Philosophy
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Many modern SaaS utilities rely heavily on expensive third-party APIs (OpenAI, Cloud Vision, paid PDF engines) that force them to introduce intrusive paywalls, credit systems, and daily usage caps. FreeToolBox is built exclusively with native browser APIs, open standards (RFC 8259 JSON, ISO 32000 PDF, Reed-Solomon QR codes), and open-source libraries. This guarantees that our core tools will remain <strong>100% free, fast, and accessible forever</strong> without hidden fees.
            </p>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Core Categories & Everyday Problem Solving
            </h3>
            <p>
              Whether you are an engineer formatting API payloads, an e-commerce merchant optimizing product photos for Google Core Web Vitals, or a student assembling a multi-page PDF project, FreeToolBox provides dedicated, precision-engineered tools:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Image Optimization:</strong> Shrink bulky camera photographs with our Image Compressor, resize dimensions for social media with Image Resizer, or convert seamlessly across JPG, PNG, and next-generation WebP.</li>
              <li><strong>PDF Operations:</strong> Combine multiple JPG and PNG images into print-ready documents with Image to PDF, or stitch together disparate PDF contracts using our client-side PDF Merger.</li>
              <li><strong>Content Analysis:</strong> Real-time word, character, and sentence tracking with reading times and keyword density breakdown using our Word Counter.</li>
              <li><strong>Developer Tools:</strong> Validate, prettify, and minify raw JSON payloads with exact line and column error indicators using our JSON Formatter.</li>
            </ul>
          </div>
        </article>
      </section>

      {/* Homepage FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Common questions regarding security, compatibility, and file limits.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Is FreeToolBox really 100% free?',
              a: 'Yes. All core utilities are completely free to use without daily limits, subscription tiers, or watermark branding.'
            },
            {
              q: 'Do you upload or store my files on your servers?',
              a: 'No. Whenever technically possible, your files are processed directly in your browser using client-side JavaScript, Canvas, and WebAssembly. Your photos, documents, and text remain on your local device.'
            },
            {
              q: 'Do I need to create an account or sign in?',
              a: 'Never. You can use any tool immediately upon loading the page without providing an email address or creating an account.'
            },
            {
              q: 'Does FreeToolBox work on mobile phones and tablets?',
              a: 'Yes! The entire platform is built with a mobile-first responsive architecture. You can upload photos from your smartphone camera roll, compress files, generate QR codes, and download results directly to your mobile device.'
            },
            {
              q: 'What is the maximum file size limit?',
              a: 'Because processing occurs inside your device’s browser memory (RAM), file size limits depend on your device hardware rather than arbitrary server quotas. Most modern smartphones and laptops easily handle images and PDFs up to 50 MB to 100 MB.'
            }
          ].map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom AdSlot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot position="below_tool" />
      </div>
    </div>
  );
};
