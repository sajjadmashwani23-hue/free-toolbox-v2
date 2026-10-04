export interface ToolKeywordMap {
  primary: string;
  longTail: string[];
  intent: string;
}

export const TOOL_KEYWORDS: Record<string, ToolKeywordMap> = {
  'qr-code-generator': { primary: 'free QR code generator', longTail: ['QR code generator online free', 'create QR code from URL', 'WiFi QR code generator', 'QR code PNG SVG download'], intent: 'Create and download a QR code in the browser.' },
  'image-compressor': { primary: 'image compressor', longTail: ['compress image online free', 'JPG PNG WebP compressor', 'reduce image file size online', 'compress image without upload'], intent: 'Reduce image file size while keeping useful visual quality.' },
  'image-resizer': { primary: 'image resizer', longTail: ['resize image online free', 'change image dimensions online', 'resize JPG PNG WebP', 'image width height resizer'], intent: 'Resize images to exact dimensions in the browser.' },
  'jpg-to-png': { primary: 'JPG to PNG converter', longTail: ['convert JPG to PNG online free', 'JPEG to PNG converter', 'JPG PNG converter no upload', 'batch JPG to PNG'], intent: 'Convert JPEG/JPG images into PNG files locally.' },
  'png-to-jpg': { primary: 'PNG to JPG converter', longTail: ['convert PNG to JPG online free', 'PNG JPEG converter', 'transparent PNG to JPG', 'batch PNG to JPG'], intent: 'Convert PNG images into widely compatible JPG files.' },
  'webp-converter': { primary: 'WebP converter', longTail: ['convert WebP to JPG PNG', 'JPG to WebP converter', 'PNG to WebP online free', 'WebP image converter online'], intent: 'Convert common image formats to or from WebP.' },
  'image-to-pdf': { primary: 'image to PDF converter', longTail: ['JPG to PDF online free', 'PNG to PDF converter', 'images to PDF no upload', 'multiple images to one PDF'], intent: 'Turn one or more images into a PDF in the browser.' },
  'merge-pdf': { primary: 'merge PDF online', longTail: ['combine PDF files free', 'merge PDF documents online', 'PDF merger no upload', 'combine multiple PDFs into one'], intent: 'Combine PDF documents into a single PDF locally.' },
  'word-counter': { primary: 'word counter', longTail: ['word counter online free', 'character counter online', 'count words and characters', 'reading time calculator'], intent: 'Count words, characters and reading metrics instantly.' },
  'json-formatter': { primary: 'JSON formatter', longTail: ['format JSON online free', 'JSON validator online', 'JSON beautifier', 'minify JSON online'], intent: 'Format, validate, beautify and minify JSON locally.' },
};

export const CATEGORY_META = {
  image: { slug: 'image-tools', name: 'Image Tools', title: 'Free Image Tools Online | Compress, Resize & Convert Images', description: 'Free browser-based image tools for compression, resizing, JPG, PNG and WebP conversion. Your files stay on your device.', keywords: ['image tools online', 'free image tools', 'image compressor', 'image resizer', 'image converter'] },
  pdf: { slug: 'pdf-tools', name: 'PDF Tools', title: 'Free PDF Tools Online | Convert & Merge PDFs', description: 'Use free browser-based PDF tools to create PDFs from images and merge PDF documents without uploading files.', keywords: ['PDF tools online', 'free PDF tools', 'merge PDF', 'image to PDF'] },
  text: { slug: 'text-tools', name: 'Text Tools', title: 'Free Text Tools Online | Word & Character Counter', description: 'Free text utilities for counting words and characters directly in your browser.', keywords: ['text tools online', 'word counter', 'character counter'] },
  developer: { slug: 'developer-tools', name: 'Developer Tools', title: 'Free Developer Tools Online | QR Codes & JSON Utilities', description: 'Practical free developer utilities including QR code generation and JSON formatting, designed to run in your browser.', keywords: ['developer tools online', 'QR code generator', 'JSON formatter', 'JSON validator'] },
} as const;
