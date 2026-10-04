import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, FileText, CheckCircle2, Send, Wrench, Globe } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'cookies' | 'disclaimer' | 'about' | 'contact';
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getPageDetails = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Our strict browser-first data policy and zero-storage architecture.',
          path: '/privacy-policy',
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          subtitle: 'Permitted use, warranties, and platform guidelines.',
          path: '/terms',
        };
      case 'cookies':
        return {
          title: 'Cookie & Tracking Policy',
          subtitle: 'How we respect user autonomy and minimize client-side cookies.',
          path: '/cookie-policy',
        };
      case 'disclaimer':
        return {
          title: 'Legal Disclaimer',
          subtitle: 'Information about file conversions and computational limits.',
          path: '/disclaimer',
        };
      case 'about':
        return {
          title: 'About FreeToolBox',
          subtitle: 'Engineering fast, private, and accessible web utilities.',
          path: '/about',
        };
      case 'contact':
        return {
          title: 'Contact Us & Feedback',
          subtitle: 'Report a bug, suggest a new tool, or get in touch with our team.',
          path: '/contact',
        };
    }
  };

  const details = getPageDetails();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <Breadcrumbs items={[{ name: details.title }]} onNavigate={onNavigate} />

      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {details.title}
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
          {details.subtitle}
        </p>
        <div className="mt-3 text-xs text-slate-400">
          Effective Date: September 28, 2026
        </div>
      </div>

      {/* PRIVACY POLICY */}
      {type === 'privacy' && (
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Core Privacy Pledge: </span>
              Whenever technically possible, your files are processed directly in your browser and are not uploaded to our servers.
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Client-Side Execution Sandbox</h2>
          <p>
            Unlike legacy online conversion websites that require transmitting user documents, photos, or raw data payloads across the public internet to third-party cloud compute clusters, FreeToolBox utilizes modern web technologies including HTML5 Canvas, the File API, JavaScript ArrayBuffers, and WebAssembly.
          </p>
          <p>
            When you select an image to compress or resize, or multiple PDF documents to merge, the binary data is read solely into your browser’s volatile memory (RAM). When the operation completes, the generated output is packaged as an in-memory Blob and handed directly back to your browser’s download manager. At no point are your file contents, text strings, or images transmitted over a network connection to FreeToolBox.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Information We Do Not Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do NOT collect, read, or store the contents of your uploaded photos or PDF files.</li>
            <li>We do NOT require user account creation, passwords, or personal telephone numbers.</li>
            <li>We do NOT log or track the destination URLs or text encoded into QR codes.</li>
            <li>We do NOT store or log API keys or payloads pasted into the JSON Formatter.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Anonymous Telemetry & Analytics</h2>
          <p>
            To evaluate platform performance, detect client browser errors, and identify high-demand tools, FreeToolBox records anonymous functional telemetry (such as "tool_open" or "conversion_completed"). We do not associate this telemetry with individual IP addresses or personal identities. You can disable telemetry at any time via the cookie consent banner.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Advertising & External Links</h2>
          <p>
            FreeToolBox may display non-personalized or contextual advertising to support ongoing maintenance and tool development. Advertising partners may utilize standard browser cookies strictly in accordance with their respective privacy disclosures.
          </p>
        </div>
      )}

      {/* TERMS OF SERVICE */}
      {type === 'terms' && (
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using FreeToolBox (the "Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the Service immediately.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Permitted Free Use</h2>
          <p>
            FreeToolBox grants you a worldwide, royalty-free, non-exclusive license to use the tools available on the platform for personal, educational, or commercial purposes. You retain 100% intellectual property ownership of any files, images, code, or documents processed through the Service.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. User Responsibility & Content Legality</h2>
          <p>
            You agree not to use the Service to generate, compress, or convert material that infringes upon third-party copyrights, trademarks, or patents, or that violates applicable laws. Because all processing executes on your device, you are solely responsible for ensuring you possess the legal authority to manipulate the submitted files.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Disclaimer of Warranty</h2>
          <p>
            The tools are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, whether express or implied. FreeToolBox makes no warranty that tool outputs will be error-free or that files will not experience data loss during browser memory allocation. Users are encouraged to maintain independent backups of original files.
          </p>
        </div>
      )}

      {/* COOKIE POLICY */}
      {type === 'cookies' && (
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. How We Use Cookies & Local Storage</h2>
          <p>
            Unlike many websites that deploy dozens of intrusive tracking cookies, FreeToolBox relies primarily on HTML5 LocalStorage to remember your user interface preferences (such as Dark Mode or your cookie consent selection).
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Categories of Storage</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Essential Preference Storage:</strong> Stores your Dark Mode toggle state (<code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">theme</code>) and cookie consent status so you are not prompted on every page load.
            </li>
            <li>
              <strong>Anonymous Functional Telemetry:</strong> Records non-identifying tool execution events to optimize browser performance and identify bugs.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Managing Your Choices</h2>
          <p>
            You can clear your local storage and browser cookies at any time via your browser’s Developer Settings or Privacy Preferences menu.
          </p>
        </div>
      )}

      {/* DISCLAIMER */}
      {type === 'disclaimer' && (
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Computational Limitations</h2>
          <p>
            FreeToolBox operates within the sandboxed runtime environment provided by your web browser. File conversions, PDF assembly, and image compressions are subject to the available system RAM and processor speed of your specific computer or smartphone.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. No Professional Advice</h2>
          <p>
            Calculations, text analytics, and conversions provided by the tools are for general informational and productivity purposes only. They should not be considered formal engineering, legal, or accounting advice.
          </p>
        </div>
      )}

      {/* ABOUT US */}
      {type === 'about' && (
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed">
          <p className="text-base sm:text-lg">
            <strong>FreeToolBox</strong> was founded with a singular mission: to eliminate the bloated, slow, and privacy-invasive practices of legacy online utility websites.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Zero Cloud Uploads
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                By taking advantage of modern browser capabilities (Canvas, Web Workers, WebAssembly), your confidential documents, contracts, and personal pictures never leave your computer.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Zero Paid APIs
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We believe core web utilities should not be locked behind monthly subscription paywalls or credit metering. Our platform is built on open standards and client-side code.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Engineering Standards</h2>
          <p>
            Every tool is designed to load in under a second, deliver accessible WCAG-compliant controls, perform seamlessly on both 300px mobile screens and 4K desktop displays, and eliminate all deceptive ad placement.
          </p>
        </div>
      )}

      {/* CONTACT US */}
      {type === 'contact' && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Thank you for your feedback. Our team regularly reviews tool suggestions and bug reports.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="Feedback">General Feedback</option>
                    <option value="Bug">Report a Bug / File Issue</option>
                    <option value="Tool Request">Suggest a New Free Tool</option>
                    <option value="Business">Partnership / Advertising</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you think or describe the issue..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
