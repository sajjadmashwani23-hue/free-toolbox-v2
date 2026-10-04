import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { 
  Upload, 
  Download, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FilePlus, 
  RefreshCw, 
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export const PdfMerger: React.FC = () => {
  const [pdfList, setPdfList] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = async (files: FileList | File[]) => {
    const valid = Array.from(files).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (valid.length === 0) {
      setError('Please select valid PDF documents (.pdf).');
      return;
    }

    setError(null);
    setIsReading(true);

    try {
      const newItems: PdfFileItem[] = [];

      for (const file of valid) {
        try {
          const buffer = await file.arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
          const count = doc.getPageCount();

          newItems.push({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            name: file.name,
            size: file.size,
            pageCount: count,
          });
        } catch (e: any) {
          setError(`Could not open "${file.name}". Password-protected or damaged PDFs cannot be merged.`);
        }
      }

      setPdfList((prev) => [...prev, ...newItems]);
    } finally {
      setIsReading(false);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPdfList((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === pdfList.length - 1) return;
    setPdfList((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setPdfList((prev) => prev.filter((i) => i.id !== id));
  };

  const handleMerge = async () => {
    if (pdfList.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setError(null);
    analytics.track('conversion_started', { toolSlug: 'merge-pdf', documentCount: pdfList.length });

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfList) {
        const buffer = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as any], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);

      analytics.track('download_clicked', { 
        toolSlug: 'merge-pdf', 
        outputFormat: 'pdf', 
        mergedCount: pdfList.length,
        totalPages: mergedPdf.getPageCount() 
      });

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `merged-document-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setIsMerging(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to merge PDF files.');
      setIsMerging(false);
    }
  };

  const totalPages = pdfList.reduce((sum, item) => sum + item.pageCount, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <FilePlus className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Upload Multiple PDF Documents
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Combine contracts, reports, receipts, and pages into a single file.
        </p>
        <button className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20">
          Select PDF Files
        </button>
      </div>

      {isReading && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-blue-600 font-semibold py-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Analyzing document pages...</span>
        </div>
      )}

      {pdfList.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Documents to Combine ({pdfList.length})
              </h4>
              <p className="text-xs text-slate-500">
                Total Output: {totalPages} pages
              </p>
            </div>
            <button
              onClick={() => setPdfList([])}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* List of PDFs */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-2">
            {pdfList.map((item, index) => (
              <div key={item.id} className="py-3 px-3 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {formatFileSize(item.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                    aria-label="Move document up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === pdfList.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                    aria-label="Move document down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label="Remove document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge CTA */}
          <button
            onClick={handleMerge}
            disabled={isMerging || pdfList.length < 2}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            {isMerging ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Merging Documents Client-Side...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Merge & Download Combined PDF ({totalPages} Pages)</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 text-red-600 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};
