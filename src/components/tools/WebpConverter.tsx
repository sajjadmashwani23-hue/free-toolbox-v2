import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, Layers, CheckCircle2, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { analytics } from '../../utils/analytics';

export const WebpConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [quality, setQuality] = useState<number>(0.85);

  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
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

  const handleFile = (selected: File) => {
    setError(null);
    setFile(selected);
    const mime = selected.type;
    setSourceFormat(mime);

    // Auto-select smart target
    if (mime === 'image/webp') {
      setTargetFormat('image/png');
    } else {
      setTargetFormat('image/webp');
    }

    const preview = URL.createObjectURL(selected);
    setPreviewSrc(preview);
    runConversion(selected, mime === 'image/webp' ? 'image/png' : 'image/webp', quality);
  };

  const runConversion = (source: File, targetMime: string, qual: number) => {
    setIsProcessing(true);
    analytics.track('conversion_started', { toolSlug: 'webp-converter', fileType: source.type });

    const reader = new FileReader();
    reader.onerror = () => {
      setError('Unable to read the file.');
      setIsProcessing(false);
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        setError('Cannot decode image. Format may be unsupported.');
        setIsProcessing(false);
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas unavailable');

          if (targetMime === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, img.width, img.height);
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                setError('Conversion failed.');
                setIsProcessing(false);
                return;
              }

              if (convertedUrl) URL.revokeObjectURL(convertedUrl);
              const url = URL.createObjectURL(blob);
              setConvertedUrl(url);
              setConvertedSize(blob.size);
              setIsProcessing(false);
              analytics.track('conversion_completed', { toolSlug: 'webp-converter', outputFormat: targetMime });
            },
            targetMime,
            qual
          );
        } catch (err: any) {
          setError(err?.message || 'Conversion error');
          setIsProcessing(false);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(source);
  };

  const handleDownload = () => {
    if (!convertedUrl || !file) return;
    analytics.track('download_clicked', { toolSlug: 'webp-converter', outputFormat: targetFormat });
    const ext = targetFormat === 'image/webp' ? 'webp' : targetFormat === 'image/png' ? 'png' : 'jpg';
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `${file.name.replace(/\.[^/.]+$/, '')}.${ext}`;
    link.click();
  };

  const handleReset = () => {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setConvertedUrl(null);
    setPreviewSrc(null);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ArrowLeftRight className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Upload Image to Convert to or from WebP
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            JPG → WebP, PNG → WebP, or WebP → JPG/PNG. 100% Client-side.
          </p>
          <button className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20">
            Select Image
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white max-w-sm truncate">
                {file.name}
              </h4>
              <p className="text-xs text-slate-500">
                Source: {file.type || 'Image'} • {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
              <span>Change Image</span>
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Destination Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image/webp', label: 'WebP' },
                  { id: 'image/png', label: 'PNG' },
                  { id: 'image/jpeg', label: 'JPG' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => {
                      setTargetFormat(fmt.id as any);
                      runConversion(file, fmt.id, quality);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      targetFormat === fmt.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                <span>Quality Setting</span>
                <span className="text-blue-600">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => {
                  const q = parseFloat(e.target.value);
                  setQuality(q);
                  runConversion(file, targetFormat, q);
                }}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">Applies to WebP and JPG lossy compression modes.</p>
            </div>
          </div>

          {/* Preview & Stats */}
          {convertedUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold">Original Size</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {formatFileSize(file.size)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-center">
                <span className="text-xs text-blue-600 uppercase font-semibold">Converted Size</span>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">
                  {formatFileSize(convertedSize)}
                </p>
              </div>
            </div>
          )}

          {/* Download Action */}
          <button
            onClick={handleDownload}
            disabled={isProcessing || !convertedUrl}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Converted File</span>
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
