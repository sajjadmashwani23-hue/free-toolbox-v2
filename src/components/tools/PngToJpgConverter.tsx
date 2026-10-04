import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, CheckCircle2, RefreshCw, Palette } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface ConvertedJpgItem {
  id: string;
  name: string;
  originalSize: number;
  jpgBlob: Blob;
  jpgUrl: string;
  jpgSize: number;
  width: number;
  height: number;
}

export const PngToJpgConverter: React.FC = () => {
  const [items, setItems] = useState<ConvertedJpgItem[]>([]);
  const [quality, setQuality] = useState<number>(0.9);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertPngToJpg = (file: File): Promise<ConvertedJpgItem> => {
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

          // Paint solid background so transparent areas do not turn black in JPEG
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, img.width, img.height);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('JPG export failed'));
              const jpgUrl = URL.createObjectURL(blob);
              resolve({
                id: `${file.name}-${Date.now()}-${Math.random()}`,
                name: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
                originalSize: file.size,
                jpgBlob: blob,
                jpgUrl,
                jpgSize: blob.size,
                width: img.width,
                height: img.height,
              });
            },
            'image/jpeg',
            quality
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(
      (f) => f.type === 'image/png' || f.name.toLowerCase().endsWith('.png')
    );

    if (validFiles.length === 0) {
      setError('Please select PNG image files.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    analytics.track('conversion_started', { toolSlug: 'png-to-jpg', count: validFiles.length });

    try {
      const results: ConvertedJpgItem[] = [];
      for (const f of validFiles) {
        const res = await convertPngToJpg(f);
        results.push(res);
      }
      setItems((prev) => [...prev, ...results]);
      analytics.track('conversion_completed', { toolSlug: 'png-to-jpg', count: results.length });
    } catch (err: any) {
      setError(err?.message || 'Error converting images');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (item: ConvertedJpgItem) => {
    analytics.track('download_clicked', { toolSlug: 'png-to-jpg', outputFormat: 'jpg' });
    const link = document.createElement('a');
    link.href = item.jpgUrl;
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
      if (target) URL.revokeObjectURL(target.jpgUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {/* Settings Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            <span>JPG Quality</span>
            <span className="text-blue-600">{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Transparency Fill Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono uppercase text-slate-600 dark:text-slate-400">
              {bgColor} (Prevents black background artifacts)
            </span>
          </div>
        </div>
      </div>

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
          accept=".png,image/png"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Upload PNG Images (Supports Batch)
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Drop .png files to convert them to lightweight JPG files.
        </p>
        <button className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20">
          Select PNG Files
        </button>
      </div>

      {isProcessing && (
        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-blue-600 font-semibold py-4">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Converting files...</span>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Converted JPG Files ({items.length})
            </h4>
            <button
              onClick={handleDownloadAll}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Download All ({items.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={item.jpgUrl}
                    alt={item.name}
                    loading="lazy" decoding="async" width={48} height={48} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.width} × {item.height} px • {formatFileSize(item.jpgSize)}
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
