import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  ShieldCheck,
  RefreshCw,
  FileDown
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface CompressedImageResult {
  originalFile: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  compressedUrl: string;
  previewUrl: string;
  width: number;
  height: number;
  reductionPercent: number;
}

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [outputFormat, setOutputFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [result, setResult] = useState<CompressedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processCompression = (sourceFile: File, compQuality: number, mimeType: string) => {
    setIsProcessing(true);
    setError(null);
    analytics.track('conversion_started', { toolSlug: 'image-compressor', fileType: sourceFile.type, fileSize: sourceFile.size });

    const reader = new FileReader();
    reader.onerror = () => {
      setError('Unable to read the image file.');
      setIsProcessing(false);
      analytics.track('tool_error', { toolSlug: 'image-compressor', errorMessage: 'FileReader error' });
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        setError('Corrupted or unsupported image file.');
        setIsProcessing(false);
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Downscale only if extremely large (e.g., > 3840px) to prevent browser memory crashes
          const maxDim = 3840;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas context not available');
          }

          // If converting to JPEG, fill white background to prevent dark transparent areas
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                setError('Failed to compress image.');
                setIsProcessing(false);
                return;
              }

              // Free previous URL
              if (result?.compressedUrl) {
                URL.revokeObjectURL(result.compressedUrl);
              }

              const compressedUrl = URL.createObjectURL(blob);
              const originalSize = sourceFile.size;
              const compressedSize = blob.size;
              const reductionPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

              setResult({
                originalFile: sourceFile,
                originalSize,
                compressedBlob: blob,
                compressedSize,
                compressedUrl,
                previewUrl: e.target?.result as string,
                width,
                height,
                reductionPercent,
              });

              setIsProcessing(false);
              analytics.track('conversion_completed', { 
                toolSlug: 'image-compressor', 
                outputFormat: mimeType,
                fileSize: compressedSize 
              });
            },
            mimeType,
            compQuality
          );
        } catch (err: any) {
          setError(err?.message || 'Compression failed.');
          setIsProcessing(false);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(sourceFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPG, PNG, WebP).');
        return;
      }
      setFile(selected);
      processCompression(selected, quality, outputFormat);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (!dropped.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      setFile(dropped);
      processCompression(dropped, quality, outputFormat);
    }
  };

  // Re-compress when slider or format changes
  useEffect(() => {
    if (file) {
      processCompression(file, quality, outputFormat);
    }
  }, [quality, outputFormat]);

  const handleDownload = () => {
    if (!result) return;
    analytics.track('download_clicked', { toolSlug: 'image-compressor', outputFormat });
    const link = document.createElement('a');
    link.href = result.compressedUrl;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/jpeg' ? 'jpg' : 'png';
    const nameWithoutExt = file?.name.replace(/\.[^/.]+$/, '') || 'optimized';
    link.download = `${nameWithoutExt}-compressed.${ext}`;
    link.click();
  };

  const handleReset = () => {
    if (result?.compressedUrl) {
      URL.revokeObjectURL(result.compressedUrl);
    }
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {!file ? (
        /* Upload Area */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Choose an image or drag & drop here
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Supports JPG, JPEG, PNG, and WebP (up to 50 MB)
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-transform hover:scale-105">
            <ImageIcon className="w-4 h-4" />
            <span>Select Image File</span>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% In-Browser Private</span>
            </span>
            <span>•</span>
            <span>No File Size Tracking</span>
          </div>
        </div>
      ) : (
        /* Compression Controls & Live Preview */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div loading="lazy" decoding="async" width={40} height={40} className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white max-w-xs truncate">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Original: {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Change Image</span>
            </button>
          </div>

          {/* Control Settings Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            {/* Quality Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                <span>Compression Quality</span>
                <span className="text-blue-600 dark:text-blue-400">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Smallest File (10%)</span>
                <span>Balanced (80%)</span>
                <span>Best Quality (95%)</span>
              </div>
            </div>

            {/* Target Format */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'image/webp', label: 'WebP (Best)' },
                  { id: 'image/jpeg', label: 'JPG' },
                  { id: 'image/png', label: 'PNG' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setOutputFormat(fmt.id as any)}
                    className={`py-2 px-3 rounded-xl font-semibold border transition-colors ${
                      outputFormat === fmt.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats & Comparison Cards */}
          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold uppercase text-slate-500">Original Size</span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {formatFileSize(result.originalSize)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
                <span className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400">Compressed Size</span>
                <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">
                  {formatFileSize(result.compressedSize)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                <span className="text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Reduction</span>
                <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1 flex items-center space-x-1">
                  <span>-{result.reductionPercent}%</span>
                  <Sparkles className="w-4 h-4" />
                </p>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {result && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center max-h-[380px]">
              <img
                src={result.compressedUrl}
                alt="Compressed preview"
                loading="lazy" decoding="async" width={800} height={600} className="max-h-[360px] w-auto object-contain rounded-lg shadow-sm"
              />
              <div className="absolute bottom-4 left-4 bg-slate-900/80 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">
                {result.width} × {result.height} px
              </div>
            </div>
          )}

          {/* Download Action Bar */}
          {result && (
            <div className="pt-2">
              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-base font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Compressing...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5" />
                    <span>Download Compressed Image ({formatFileSize(result.compressedSize)})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}
    </div>
  );
};
