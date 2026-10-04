import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, CheckCircle2, FileImage, Sparkles, RefreshCw } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface ConvertedItem {
  id: string;
  name: string;
  originalSize: number;
  pngBlob: Blob;
  pngUrl: string;
  pngSize: number;
  width: number;
  height: number;
}

export const JpgToPngConverter: React.FC = () => {
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertFile = (file: File): Promise<ConvertedItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error(`Cannot decode ${file.name}`));
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas 2D context error'));

          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('PNG export failed'));
            const pngUrl = URL.createObjectURL(blob);
            resolve({
              id: `${file.name}-${Date.now()}-${Math.random()}`,
              name: file.name.replace(/\.[^/.]+$/, '') + '.png',
              originalSize: file.size,
              pngBlob: blob,
              pngUrl,
              pngSize: blob.size,
              width: img.width,
              height: img.height,
            });
          }, 'image/png');
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(
      (f) => f.type === 'image/jpeg' || f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg')
    );

    if (validFiles.length === 0) {
      setError('Please select JPG or JPEG image files.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    analytics.track('conversion_started', { toolSlug: 'jpg-to-png', count: validFiles.length });

    try {
      const results: ConvertedItem[] = [];
      for (const f of validFiles) {
        const res = await convertFile(f);
        results.push(res);
      }
      setItems((prev) => [...prev, ...results]);
      analytics.track('conversion_completed', { toolSlug: 'jpg-to-png', count: results.length });
    } catch (err: any) {
      setError(err?.message || 'Error converting images');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: ConvertedItem) => {
    analytics.track('download_clicked', { toolSlug: 'jpg-to-png', outputFormat: 'png' });
    const link = document.createElement('a');
    link.href = item.pngUrl;
    link.download = item.name;
    link.click();
  };

  const handleDownloadAll = () => {
    items.forEach((item, index) => {
      setTimeout(() => {
        handleDownloadSingle(item);
      }, index * 200);
    });
  };

  const handleRemove = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.pngUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.pngUrl));
    setItems([]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {/* Upload Zone */}
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
          accept=".jpg,.jpeg,image/jpeg"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <FileImage className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Upload JPG Images (Supports Batch)
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Drop .jpg or .jpeg files here for instant client-side conversion to lossless PNG.
        </p>
        <button className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20">
          Choose JPG Files
        </button>
      </div>

      {isProcessing && (
        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-blue-600 font-semibold py-4">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Converting files in browser...</span>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Converted PNG Files ({items.length})
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadAll}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Download All ({items.length})
              </button>
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={item.pngUrl}
                    alt={item.name}
                    loading="lazy" decoding="async" width={48} height={48} className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.width} × {item.height} px • {formatFileSize(item.pngSize)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownloadSingle(item)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
