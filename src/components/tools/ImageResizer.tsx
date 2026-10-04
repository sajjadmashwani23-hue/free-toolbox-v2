import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Maximize2, 
  Lock, 
  Unlock, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface Preset {
  name: string;
  width: number;
  height: number;
  tag: string;
}

const PRESETS: Preset[] = [
  { name: 'Instagram Square', width: 1080, height: 1080, tag: '1:1' },
  { name: 'Instagram Story / Reel', width: 1080, height: 1920, tag: '9:16' },
  { name: 'Full HD Landscape', width: 1920, height: 1080, tag: '16:9' },
  { name: 'HD Video', width: 1280, height: 720, tag: '16:9' },
  { name: 'Social Share Card', width: 1200, height: 630, tag: 'OG' },
  { name: 'Avatar / Profile', width: 512, height: 512, tag: '1:1' },
];

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const [targetWidth, setTargetWidth] = useState<number>(1080);
  const [targetHeight, setTargetHeight] = useState<number>(1080);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.92);

  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      setError(null);
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setImageSrc(url);

      const img = new Image();
      img.onload = () => {
        imgElementRef.current = img;
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        generateResized(img, img.width, img.height, outputFormat, quality);
      };
      img.src = url;
    }
  };

  const generateResized = (
    img: HTMLImageElement,
    w: number,
    h: number,
    format: string,
    qual: number
  ) => {
    if (w <= 0 || h <= 0) return;
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Solid background fill for JPG
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResizedSize(blob.size);
            const dataUrl = URL.createObjectURL(blob);
            setResizedDataUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return dataUrl;
            });
            setIsProcessing(false);
          }
        },
        format,
        qual
      );
    } catch (err: any) {
      setError(err?.message || 'Error resizing image');
      setIsProcessing(false);
    }
  };

  // Handle width change with aspect ratio locking
  const handleWidthChange = (newWidth: number) => {
    setTargetWidth(newWidth);
    if (lockRatio && originalWidth > 0) {
      const calculatedHeight = Math.round((newWidth * originalHeight) / originalWidth);
      setTargetHeight(calculatedHeight);
      if (imgElementRef.current) {
        generateResized(imgElementRef.current, newWidth, calculatedHeight, outputFormat, quality);
      }
    } else if (imgElementRef.current) {
      generateResized(imgElementRef.current, newWidth, targetHeight, outputFormat, quality);
    }
  };

  // Handle height change with aspect ratio locking
  const handleHeightChange = (newHeight: number) => {
    setTargetHeight(newHeight);
    if (lockRatio && originalHeight > 0) {
      const calculatedWidth = Math.round((newHeight * originalWidth) / originalHeight);
      setTargetWidth(calculatedWidth);
      if (imgElementRef.current) {
        generateResized(imgElementRef.current, calculatedWidth, newHeight, outputFormat, quality);
      }
    } else if (imgElementRef.current) {
      generateResized(imgElementRef.current, targetWidth, newHeight, outputFormat, quality);
    }
  };

  const applyPreset = (preset: Preset) => {
    setLockRatio(false);
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    if (imgElementRef.current) {
      generateResized(imgElementRef.current, preset.width, preset.height, outputFormat, quality);
    }
  };

  const handleDownload = () => {
    if (!resizedDataUrl) return;
    analytics.track('download_clicked', { toolSlug: 'image-resizer', outputFormat });
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const link = document.createElement('a');
    link.href = resizedDataUrl;
    link.download = `resized-${targetWidth}x${targetHeight}.${ext}`;
    link.click();
  };

  const handleReset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (resizedDataUrl) URL.revokeObjectURL(resizedDataUrl);
    setFile(null);
    setImageSrc(null);
    setResizedDataUrl(null);
    imgElementRef.current = null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-10 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/20 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Maximize2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Upload Image to Resize
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            JPG, PNG, or WebP. 100% Client-side processing.
          </p>
          <button className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20">
            Select File
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-sm">
                {file.name}
              </h4>
              <p className="text-xs text-slate-500">
                Original Dimensions: {originalWidth} × {originalHeight} px ({formatFileSize(file.size)})
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

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Popular Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    targetWidth === p.width && targetHeight === p.height
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.width}×{p.height}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Width (Pixels)
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={targetWidth}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLockRatio(!lockRatio)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors ${
                  lockRatio
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {lockRatio ? <Lock className="w-4 h-4 text-blue-600" /> : <Unlock className="w-4 h-4" />}
                <span>{lockRatio ? 'Ratio Locked' : 'Ratio Unlocked'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Height (Pixels)
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={targetHeight}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold"
              />
            </div>
          </div>

          {/* Format selection */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Format:
              </span>
              <div className="flex space-x-1.5">
                {[
                  { id: 'image/jpeg', label: 'JPG' },
                  { id: 'image/png', label: 'PNG' },
                  { id: 'image/webp', label: 'WebP' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => {
                      setOutputFormat(fmt.id as any);
                      if (imgElementRef.current) {
                        generateResized(imgElementRef.current, targetWidth, targetHeight, fmt.id, quality);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      outputFormat === fmt.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              New File Size: <span className="font-bold text-slate-900 dark:text-white">{formatFileSize(resizedSize)}</span>
            </div>
          </div>

          {/* Preview Canvas / Box */}
          {resizedDataUrl && (
            <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl flex items-center justify-center max-h-80 overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src={resizedDataUrl}
                alt="Resized output preview"
                loading="lazy" decoding="async" width={800} height={600} className="max-h-72 w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            <Download className="w-5 h-5" />
            <span>Download Resized Image ({targetWidth} × {targetHeight} px)</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 text-red-600 text-xs rounded-xl border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}
    </div>
  );
};
