import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Download, 
  Copy, 
  Check, 
  QrCode as QrIcon, 
  Wifi, 
  Globe, 
  Type, 
  Mail, 
  Phone,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

type Mode = 'url' | 'text' | 'wifi' | 'email' | 'phone';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export const QrCodeGenerator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('url');
  const [urlInput, setUrlInput] = useState('https://freetoolbox.app');
  const [textInput, setTextInput] = useState('');
  
  // Wi-Fi fields
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Email / Phone
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [phoneNum, setPhoneNum] = useState('');

  // Styling options
  const [size, setSize] = useState<number>(360);
  const [margin, setMargin] = useState<number>(3);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M');
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Derive final payload string based on current mode
  const getPayload = (): string => {
    switch (mode) {
      case 'url':
        return urlInput.trim() || 'https://';
      case 'text':
        return textInput.trim() || 'Sample text';
      case 'wifi':
        return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      case 'phone':
        return `tel:${phoneNum}`;
      default:
        return 'https://freetoolbox.app';
    }
  };

  // Generate QR Code on canvas and generate SVG string
  useEffect(() => {
    const payload = getPayload();
    if (!payload) return;

    setError(null);

    // 1. Generate on Canvas
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: size,
          margin: margin,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        },
        (err) => {
          if (err) {
            setError('Failed to generate QR code. Content may be too long for selected error correction level.');
            analytics.track('tool_error', { toolSlug: 'qr-code-generator', errorMessage: err.message });
          } else {
            analytics.track('conversion_completed', { toolSlug: 'qr-code-generator' });
          }
        }
      );
    }

    // 2. Generate SVG
    QRCode.toString(
      payload,
      {
        type: 'svg',
        margin: margin,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (err, string) => {
        if (!err && string) {
          setSvgString(string);
        }
      }
    );
  }, [mode, urlInput, textInput, wifiSsid, wifiPassword, wifiAuth, emailTo, emailSubject, phoneNum, size, margin, errorLevel, fgColor, bgColor]);

  const downloadFile = (format: 'png' | 'jpg' | 'svg') => {
    if (!canvasRef.current) return;
    analytics.track('download_clicked', { toolSlug: 'qr-code-generator', outputFormat: format });

    if (format === 'svg') {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvasRef.current.toDataURL(mime, 0.95);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qrcode-${Date.now()}.${format}`;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // Fallback
      navigator.clipboard.writeText(getPayload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
      {/* Type Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'url', label: 'Website URL', icon: Globe },
          { id: 'text', label: 'Plain Text', icon: Type },
          { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'phone', label: 'Phone Call', icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as Mode)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Form Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* Inputs based on Mode */}
          {mode === 'url' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Website or Link URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1.5">Enter the full web address including https://</p>
            </div>
          )}

          {mode === 'text' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Plain Text Message
              </label>
              <textarea
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type or paste text content here..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {mode === 'wifi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="e.g. Guest-WiFi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="WiFi Password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Security Type
                  </label>
                  <select
                    value={wifiAuth}
                    onChange={(e) => setWifiAuth(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="WPA">WPA/WPA2/WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Subject line"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          )}

          {mode === 'phone' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          )}

          {/* Customization Controls Accordion / Panel */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Resolution & Error Correction</span>
              <span className="text-[11px] text-blue-600 font-medium">Reed-Solomon</span>
            </h4>

            {/* Size Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Pixel Dimension:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{size} × {size} px</span>
              </div>
              <input
                type="range"
                min="160"
                max="800"
                step="20"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Margin Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Quiet Zone Margin:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{margin} blocks</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Error Correction Level */}
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                Error Correction Tolerance:
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'L', label: 'Low (7%)' },
                  { id: 'M', label: 'Medium (15%)' },
                  { id: 'Q', label: 'Quartile (25%)' },
                  { id: 'H', label: 'High (30%)' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setErrorLevel(lvl.id as ErrorCorrectionLevel)}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors font-medium ${
                      errorLevel === lvl.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono uppercase text-slate-700 dark:text-slate-300">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono uppercase text-slate-700 dark:text-slate-300">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}
        </div>

        {/* Right Preview & Downloads */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Preview</span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Scannable</span>
            </span>
          </div>

          {/* QR Canvas Container */}
          <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center max-w-full overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded" />
          </div>

          {/* Download & Copy Buttons */}
          <div className="w-full mt-6 space-y-2.5">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => downloadFile('png')}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG</span>
              </button>
              <button
                onClick={() => downloadFile('svg')}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                title="Scalable Vector Graphics for billboard or print"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG</span>
              </button>
              <button
                onClick={() => downloadFile('jpg')}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JPG</span>
              </button>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Image or Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
