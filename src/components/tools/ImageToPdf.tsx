import React, { useState, useRef } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { 
  Upload, 
  Download, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FileSpreadsheet, 
  RefreshCw, 
  Plus,
  FileCheck2
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

type PageSizeOption = 'A4' | 'Letter' | 'Fit';
type OrientationOption = 'portrait' | 'landscape';
type MarginOption = 'none' | 'small' | 'normal';

export const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>('A4');
  const [orientation, setOrientation] = useState<OrientationOption>('portrait');
  const [margin, setMargin] = useState<MarginOption>('small');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = (files: FileList | File[]) => {
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || f.name.match(/\.(jpg|jpeg|png|webp)$/i)
    );

    if (valid.length === 0) {
      setError('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    setError(null);
    const newItems: ImageItem[] = valid.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  // Convert all images to array buffers and build the PDF
  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setError(null);
    analytics.track('conversion_started', { toolSlug: 'image-to-pdf', imageCount: images.length });

    try {
      const pdfDoc = await PDFDocument.create();

      // Margins in points (72 points = 1 inch)
      const marginPt = margin === 'none' ? 0 : margin === 'small' ? 18 : 36;

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let pdfImage;

        // pdf-lib supports JPEG and PNG embedding natively.
        // For WebP or fallback, draw to canvas and extract JPEG bytes
        if (item.file.type === 'image/jpeg' || item.file.name.match(/\.(jpg|jpeg)$/i)) {
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (item.file.type === 'image/png' || item.file.name.match(/\.png$/i)) {
          try {
            pdfImage = await pdfDoc.embedPng(arrayBuffer);
          } catch {
            // Some PNGs with odd color profiles can be converted via canvas
            pdfImage = await embedViaCanvas(pdfDoc, item.file);
          }
        } else {
          // WebP or other format -> canvas render to JPEG
          pdfImage = await embedViaCanvas(pdfDoc, item.file);
        }

        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;

        let pageWidth = 595.28; // A4 standard pt
        let pageHeight = 841.89;

        if (pageSize === 'Letter') {
          pageWidth = 612;
          pageHeight = 792;
        } else if (pageSize === 'Fit') {
          pageWidth = imgWidth + marginPt * 2;
          pageHeight = imgHeight + marginPt * 2;
        }

        // Handle Orientation
        if (pageSize !== 'Fit') {
          if (orientation === 'landscape') {
            const temp = pageWidth;
            pageWidth = pageHeight;
            pageHeight = temp;
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Compute aspect ratio scaling inside page dimensions minus margins
        const availWidth = pageWidth - marginPt * 2;
        const availHeight = pageHeight - marginPt * 2;

        const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        // Center on page
        const x = marginPt + (availWidth - drawWidth) / 2;
        const y = marginPt + (availHeight - drawHeight) / 2;

        page.drawImage(pdfImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);

      analytics.track('download_clicked', { toolSlug: 'image-to-pdf', outputFormat: 'pdf', pages: images.length });

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `document-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setIsGenerating(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to assemble PDF document.');
      setIsGenerating(false);
    }
  };

  // Helper to re-encode unusual PNG or WebP into standard JPEG bytes for pdf-lib
  const embedViaCanvas = (pdfDoc: PDFDocument, file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas error');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, img.width, img.height);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(async (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) return reject(new Error('Canvas export failed'));
            const bytes = await blob.arrayBuffer();
            const embedded = await pdfDoc.embedJpg(bytes);
            resolve(embedded);
          }, 'image/jpeg', 0.92);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error('Cannot decode image for PDF embedding'));
      img.src = url;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <FileSpreadsheet className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Upload One or Multiple Images
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          JPG, PNG, or WebP files. Reorder and customize before converting.
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20">
          Select Images
        </button>
      </div>

      {images.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Layout Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Page Size */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Page Size
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['A4', 'Letter', 'Fit'] as PageSizeOption[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setPageSize(size)}
                    className={`py-1.5 px-2 rounded-lg font-semibold border transition-colors ${
                      pageSize === size
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {size === 'Fit' ? 'Fit Image' : size}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Orientation
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(['portrait', 'landscape'] as OrientationOption[]).map((ori) => (
                  <button
                    key={ori}
                    onClick={() => setOrientation(ori)}
                    disabled={pageSize === 'Fit'}
                    className={`py-1.5 px-2 rounded-lg font-semibold border capitalize transition-colors disabled:opacity-40 ${
                      orientation === ori
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {ori}
                  </button>
                ))}
              </div>
            </div>

            {/* Margin */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Margins
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['none', 'small', 'normal'] as MarginOption[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMargin(m)}
                    className={`py-1.5 px-2 rounded-lg font-semibold border capitalize transition-colors ${
                      margin === m
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reorderable Image Page Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>PDF Pages Order ({images.length} pages)</span>
              <span>Use arrows to reorder</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-2">
              {images.map((item, index) => (
                <div key={item.id} className="py-2.5 px-3 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      loading="lazy" decoding="async" width={40} height={40} className="w-10 h-10 rounded object-cover border bg-white"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatFileSize(item.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                      aria-label="Move page up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                      aria-label="Move page down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      aria-label="Remove page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={generatePdf}
            disabled={isGenerating}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Assembling PDF in Browser...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Convert & Download PDF ({images.length} {images.length === 1 ? 'Page' : 'Pages'})</span>
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
