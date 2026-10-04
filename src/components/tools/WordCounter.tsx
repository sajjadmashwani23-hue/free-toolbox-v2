import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  Clock, 
  Volume2, 
  AlignLeft,
  BookOpen
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

const SAMPLE_TEXT = `Search engine optimization (SEO) and web performance are inextricably linked. Fast websites with optimized assets, clean semantic structure, and client-side processing deliver superior user experiences and convert higher. When users access free online tools, they expect immediate results without intrusive paywalls or data exploitation. FreeToolBox processes data directly in your browser, guaranteeing both speed and privacy.`;

// Common stop words to exclude from keyword density for meaningful insight
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
  'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll',
  'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d',
  'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more',
  'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should',
  'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re',
  'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who',
  'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re',
  'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Computations
  const stats = useMemo(() => {
    const trimmed = text.trim();

    // Characters
    const charsTotal = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;

    // Words
    const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = wordsArray.length;

    // Sentences
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      : [];
    const sentenceCount = sentences.length;

    // Paragraphs
    const paragraphs = trimmed
      ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0)
      : [];
    const paragraphCount = paragraphs.length;

    // Reading time: avg 200 words per minute
    const readingMinutes = Math.ceil(wordCount / 200);
    const readingTime = wordCount === 0 ? '0 sec' : readingMinutes < 1 ? '< 1 min' : `${readingMinutes} min`;

    // Speaking time: avg 130 words per minute
    const speakingMinutes = Math.ceil(wordCount / 130);
    const speakingTime = wordCount === 0 ? '0 sec' : speakingMinutes < 1 ? '< 1 min' : `${speakingMinutes} min`;

    // Keyword density
    const frequencyMap = new Map<string, number>();
    wordsArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2 && !STOP_WORDS.has(clean)) {
        frequencyMap.set(clean, (frequencyMap.get(clean) || 0) + 1);
      }
    });

    const topKeywords = Array.from(frequencyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        percent: wordCount > 0 ? ((count / wordCount) * 100).toFixed(1) : '0',
      }));

    return {
      wordCount,
      charsTotal,
      charsNoSpaces,
      sentenceCount,
      paragraphCount,
      readingTime,
      speakingTime,
      topKeywords,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    analytics.track('download_clicked', { toolSlug: 'word-counter', action: 'copy_text' });
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setText(SAMPLE_TEXT);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Total Words
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">
            {stats.wordCount.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Characters (All)
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats.charsTotal.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Chars (No Spaces)
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats.charsNoSpaces.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Sentences
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
            {stats.sentenceCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Editor Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Read: {stats.readingTime}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Speak: {stats.speakingTime}</span>
            </span>
            <span>Paragraphs: {stats.paragraphCount}</span>
          </div>

          <div className="flex items-center space-x-2">
            {!text && (
              <button
                onClick={loadSample}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Load Sample Text
              </button>
            )}
            {text && (
              <button
                onClick={() => setText('')}
                className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to get instant word count, character analysis, reading time, and keyword density..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-900 dark:text-white text-base leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            {stats.wordCount > 0 ? `${stats.wordCount} words recorded` : 'Ready to count'}
          </span>
          <button
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Keyword Frequency Density Section */}
      {stats.topKeywords.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
            <span>Keyword Frequency (Excluding Common Words)</span>
            <span className="text-[11px] text-slate-400 font-normal">Density Analysis</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stats.topKeywords.map((k) => (
              <div
                key={k.word}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize truncate mr-2">
                  {k.word}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {k.count}x ({k.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
