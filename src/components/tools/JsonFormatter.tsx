import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  FileCode,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

const SAMPLE_JSON = `{
  "platform": "FreeToolBox",
  "version": "1.0.0",
  "features": [
    "100% In-Browser",
    "Zero File Uploads",
    "Ultra Fast WebAssembly",
    "Completely Free"
  ],
  "security": {
    "cloudStorage": false,
    "privacyGuaranteed": true,
    "paidApiKeysRequired": false
  },
  "metrics": {
    "toolsAvailable": 10,
    "targetLatencyMs": 0
  }
}`;

export const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [indentation, setIndentation] = useState<2 | 4>(2);
  const [validationStatus, setValidationStatus] = useState<{
    valid: boolean;
    error?: string;
    line?: number;
    column?: number;
  }>({ valid: true });

  const [copied, setCopied] = useState<boolean>(false);

  // Validate and format
  const formatJson = (spaces: number = indentation) => {
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, spaces);
      setInputJson(formatted);
      setValidationStatus({ valid: true });
      analytics.track('conversion_completed', { toolSlug: 'json-formatter', action: 'format' });
    } catch (err: any) {
      extractErrorInfo(err.message);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setInputJson(minified);
      setValidationStatus({ valid: true });
      analytics.track('conversion_completed', { toolSlug: 'json-formatter', action: 'minify' });
    } catch (err: any) {
      extractErrorInfo(err.message);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(inputJson);
      setValidationStatus({ valid: true });
      analytics.track('conversion_completed', { toolSlug: 'json-formatter', action: 'validate' });
    } catch (err: any) {
      extractErrorInfo(err.message);
    }
  };

  const extractErrorInfo = (msg: string) => {
    // Chrome format: "Unexpected token ' in JSON at position 12"
    // or "... at line 2 column 5"
    let line: number | undefined;
    let column: number | undefined;

    const posMatch = msg.match(/position\s+(\d+)/i);
    if (posMatch && posMatch[1]) {
      const pos = parseInt(posMatch[1], 10);
      const lines = inputJson.slice(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    setValidationStatus({
      valid: false,
      error: msg,
      line,
      column,
    });
    analytics.track('tool_error', { toolSlug: 'json-formatter', errorMessage: msg });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    analytics.track('download_clicked', { toolSlug: 'json-formatter', action: 'copy_json' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    analytics.track('download_clicked', { toolSlug: 'json-formatter', outputFormat: 'json' });
    const blob = new Blob([inputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `formatted-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const charCount = inputJson.length;
  const lineCount = inputJson ? inputJson.split('\n').length : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => formatJson(2)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105"
          >
            Prettify (2 spaces)
          </button>
          <button
            onClick={() => formatJson(4)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Prettify (4 spaces)
          </button>
          <button
            onClick={minifyJson}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Minify (Compact)
          </button>
          <button
            onClick={validateJson}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Validate JSON
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setInputJson(SAMPLE_JSON)}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Reset Sample
          </button>
          <button
            onClick={() => setInputJson('')}
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {validationStatus.valid ? (
        <div className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs rounded-xl border border-emerald-200 dark:border-emerald-900/50">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-semibold">Valid JSON Syntax (RFC 8259 Compliant)</span>
        </div>
      ) : (
        <div className="flex items-start space-x-2 px-3.5 py-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Invalid JSON Syntax</div>
            <div className="mt-0.5 font-mono text-[11px]">{validationStatus.error}</div>
            {validationStatus.line && (
              <div className="mt-1 font-semibold">
                Approx. Location: Line {validationStatus.line}, Column {validationStatus.column}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor Box */}
      <div className="relative">
        <textarea
          rows={14}
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value);
            // Realtime lightweight syntax validation check
            try {
              if (e.target.value.trim()) {
                JSON.parse(e.target.value);
                setValidationStatus({ valid: true });
              }
            } catch (err: any) {
              extractErrorInfo(err.message);
            }
          }}
          placeholder="Paste or write raw JSON here..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
          spellCheck={false}
        />
        <div className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded backdrop-blur-sm">
          {lineCount} lines • {charCount} chars
        </div>
      </div>

      {/* Download & Copy Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500">
          Client-side parsing ensures API credentials and tokens remain 100% private.
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            disabled={!inputJson}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={!inputJson}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-40 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download .json</span>
          </button>
        </div>
      </div>
    </div>
  );
};
