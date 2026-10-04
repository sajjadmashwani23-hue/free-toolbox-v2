import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToolSearchModal } from './components/ToolSearchModal';
import { CookieConsent } from './components/CookieConsent';
import { ToolLayout } from './components/ToolLayout';
import { OfflineIndicator } from './components/OfflineIndicator';

import { HomePage } from './pages/HomePage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CategoryPage } from './pages/CategoryPage';
import { CATEGORY_META } from './data/seoKeywords';

import { TOOLS } from './data/toolsData';
import { GUIDES } from './data/guidesData';
import { updateSEOMeta, generateToolSchema, generateGuideSchema } from './utils/seo';
import { analytics } from './utils/analytics';

// Tool components are code-split: each tool's JS (and heavy libs like pdf-lib / qrcode)
// is only downloaded on the page that actually uses it.
const QrCodeGenerator = lazy(() => import('./components/tools/QrCodeGenerator').then((m) => ({ default: m.QrCodeGenerator })));
const ImageCompressor = lazy(() => import('./components/tools/ImageCompressor').then((m) => ({ default: m.ImageCompressor })));
const ImageResizer = lazy(() => import('./components/tools/ImageResizer').then((m) => ({ default: m.ImageResizer })));
const JpgToPngConverter = lazy(() => import('./components/tools/JpgToPngConverter').then((m) => ({ default: m.JpgToPngConverter })));
const PngToJpgConverter = lazy(() => import('./components/tools/PngToJpgConverter').then((m) => ({ default: m.PngToJpgConverter })));
const WebpConverter = lazy(() => import('./components/tools/WebpConverter').then((m) => ({ default: m.WebpConverter })));
const ImageToPdf = lazy(() => import('./components/tools/ImageToPdf').then((m) => ({ default: m.ImageToPdf })));
const PdfMerger = lazy(() => import('./components/tools/PdfMerger').then((m) => ({ default: m.PdfMerger })));
const WordCounter = lazy(() => import('./components/tools/WordCounter').then((m) => ({ default: m.WordCounter })));
const JsonFormatter = lazy(() => import('./components/tools/JsonFormatter').then((m) => ({ default: m.JsonFormatter })));

const ToolFallback = () => (
  <div className="min-h-[320px] flex items-center justify-center text-sm text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
    Loading tool…
  </div>
);

export default function App({ initialPath }: { initialPath?: string } = {}) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (initialPath) return initialPath;
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ftb_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ftb_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ftb_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global keyboard shortcuts (Cmd+K or / to search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentPath(path);
  };

  // Dynamic SEO Updates based on Current Path
  useEffect(() => {
    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    // 1. Tool Pages
    const tool = TOOLS.find((t) => `/${t.slug}` === cleanPath || `/tools/${t.slug}` === cleanPath);
    if (tool) {
      updateSEOMeta({
        title: tool.seoTitle,
        description: tool.metaDescription,
        canonicalPath: `/${tool.slug}`,
        schema: generateToolSchema(tool),
      });
      analytics.track('tool_open', { toolSlug: tool.slug });
      return;
    }

    // 2. Tool Categories
    const categoryEntry = Object.entries(CATEGORY_META).find(([, meta]) => cleanPath === `/tools/${meta.slug}`);
    if (categoryEntry) {
      const [category, meta] = categoryEntry;
      updateSEOMeta({
        title: meta.title,
        description: meta.description,
        canonicalPath: `/tools/${meta.slug}`,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: meta.name,
          description: meta.description,
          url: `https://freetoolbox.app/tools/${meta.slug}`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: TOOLS.filter((t) => t.category === category).map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title, url: `https://freetoolbox.app/${t.slug}` }))
          }
        }
      });
      return;
    }

    // 3. Guides Pages
    if (cleanPath === '/guides') {
      updateSEOMeta({
        title: 'Guides & Technical Tutorials | FreeToolBox',
        description: 'Read in-depth technical guides answering real questions about image compression, QR codes, file conversions, and modern web tools.',
        canonicalPath: '/guides',
      });
      return;
    }

    if (cleanPath.startsWith('/guides/')) {
      const slug = cleanPath.replace('/guides/', '');
      const guide = GUIDES.find((g) => g.slug === slug);
      if (guide) {
        updateSEOMeta({
          title: guide.title,
          description: guide.description,
          canonicalPath: `/guides/${guide.slug}`,
          schema: generateGuideSchema(guide),
        });
        return;
      }
    }

    // 4. Legal & Trust Pages
    if (cleanPath === '/privacy-policy') {
      updateSEOMeta({
        title: 'Privacy Policy | FreeToolBox – Zero Cloud Uploads',
        description: 'Learn how FreeToolBox processes files client-side inside your browser sandbox with zero cloud storage.',
        canonicalPath: '/privacy-policy',
      });
      return;
    }

    if (cleanPath === '/terms') {
      updateSEOMeta({
        title: 'Terms of Service | FreeToolBox',
        description: 'Review terms of use, warranties, and platform guidelines for FreeToolBox.',
        canonicalPath: '/terms',
      });
      return;
    }

    if (cleanPath === '/cookie-policy') {
      updateSEOMeta({
        title: 'Cookie Policy | FreeToolBox',
        description: 'Information regarding local storage preferences and cookie usage.',
        canonicalPath: '/cookie-policy',
      });
      return;
    }

    if (cleanPath === '/disclaimer') {
      updateSEOMeta({
        title: 'Legal Disclaimer | FreeToolBox',
        description: 'Important legal notices regarding browser computation and data safety.',
        canonicalPath: '/disclaimer',
      });
      return;
    }

    if (cleanPath === '/about') {
      updateSEOMeta({
        title: 'About Us | FreeToolBox – Why In-Browser Tools Matter',
        description: 'Learn about our engineering philosophy: zero paid APIs, zero cloud uploads, and fast client-side performance.',
        canonicalPath: '/about',
      });
      return;
    }

    if (cleanPath === '/contact') {
      updateSEOMeta({
        title: 'Contact Us & Feedback | FreeToolBox',
        description: 'Get in touch with the FreeToolBox team, submit feature requests, or report issues.',
        canonicalPath: '/contact',
      });
      return;
    }

    // 5. Default: Homepage
    if (cleanPath === '/') {
      updateSEOMeta({
        title: 'FreeToolBox – Free Online Tools | Fast, Private & Easy to Use',
        description: 'Fast, private, and free online tools to convert, compress, generate, and format files and data directly in your browser without uploads.',
        canonicalPath: '/',
      });
      return;
    }

    updateSEOMeta({
      title: 'Page Not Found | FreeToolBox',
      description: 'The requested FreeToolBox page could not be found.',
      canonicalPath: '/',
      robots: 'noindex, nofollow',
    });
  }, [currentPath]);

  // Route Rendering Logic
  const renderContent = () => {
    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    // Tool Routes
    const tool = TOOLS.find((t) => `/${t.slug}` === cleanPath || `/tools/${t.slug}` === cleanPath);
    if (tool) {
      return (
        <ToolLayout tool={tool} onNavigate={navigate}>
          <Suspense fallback={<ToolFallback />}>
          {tool.slug === 'qr-code-generator' && <QrCodeGenerator />}
          {tool.slug === 'image-compressor' && <ImageCompressor />}
          {tool.slug === 'image-resizer' && <ImageResizer />}
          {tool.slug === 'jpg-to-png' && <JpgToPngConverter />}
          {tool.slug === 'png-to-jpg' && <PngToJpgConverter />}
          {tool.slug === 'webp-converter' && <WebpConverter />}
          {tool.slug === 'image-to-pdf' && <ImageToPdf />}
          {tool.slug === 'merge-pdf' && <PdfMerger />}
          {tool.slug === 'word-counter' && <WordCounter />}
          {tool.slug === 'json-formatter' && <JsonFormatter />}
          </Suspense>
        </ToolLayout>
      );
    }

    // Tool category routes
    const categoryEntry = Object.entries(CATEGORY_META).find(([, meta]) => cleanPath === `/tools/${meta.slug}`);
    if (categoryEntry) {
      return <CategoryPage category={categoryEntry[0] as keyof typeof CATEGORY_META} onNavigate={navigate} />;
    }

    // Guides Routes
    if (cleanPath === '/guides') {
      return <GuidesPage onNavigate={navigate} />;
    }

    if (cleanPath.startsWith('/guides/')) {
      const slug = cleanPath.replace('/guides/', '');
      const guide = GUIDES.find((g) => g.slug === slug);
      if (guide) {
        return <GuideDetailPage guide={guide} onNavigate={navigate} />;
      }
    }

    // Legal / Company Routes
    if (cleanPath === '/privacy-policy') return <LegalPage type="privacy" onNavigate={navigate} />;
    if (cleanPath === '/terms') return <LegalPage type="terms" onNavigate={navigate} />;
    if (cleanPath === '/cookie-policy') return <LegalPage type="cookies" onNavigate={navigate} />;
    if (cleanPath === '/disclaimer') return <LegalPage type="disclaimer" onNavigate={navigate} />;
    if (cleanPath === '/about') return <LegalPage type="about" onNavigate={navigate} />;
    if (cleanPath === '/contact') return <LegalPage type="contact" onNavigate={navigate} />;

    // Homepage Route
    if (cleanPath === '/') {
      return <HomePage onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />;
    }

    // 404 Custom Fallback
    return <NotFoundPage onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <OfflineIndicator />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer onNavigate={navigate} />

      <ToolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      <CookieConsent />
    </div>
  );
}
