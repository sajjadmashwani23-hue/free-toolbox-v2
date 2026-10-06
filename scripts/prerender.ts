import fs from 'node:fs';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import App from '../src/App';
import { TOOLS } from '../src/data/toolsData';
import { GUIDES } from '../src/data/guidesData';
import { CATEGORY_META } from '../src/data/seoKeywords';

const base='https://freetoolbox.app';
const routes = [
  '/', ...TOOLS.map(t=>`/${t.slug}`), ...Object.values(CATEGORY_META).map(c=>`/tools/${c.slug}`),
  '/guides', ...GUIDES.map(g=>`/guides/${g.slug}`), '/about','/contact','/privacy-policy','/terms','/cookie-policy','/disclaimer'
];
const root=path.resolve('dist');
const rawTemplate=fs.readFileSync(path.join(root,'index.html'),'utf8');
// The built index.html still carries the homepage's <title>, description, canonical, robots, Open Graph and
// Twitter tags. Strip them so each prerendered page gets exactly ONE set (its own) instead of duplicates
// with a conflicting homepage canonical.
const template=rawTemplate
  .replace(/<title>[\s\S]*?<\/title>/gi,'')
  .replace(/<meta\s+name="(?:description|robots)"[^>]*>\s*/gi,'')
  .replace(/<link\s+rel="canonical"[^>]*>\s*/gi,'')
  .replace(/<meta\s+property="og:(?:title|description|url|image|type)"[^>]*>\s*/gi,'')
  .replace(/<meta\s+name="twitter:(?:card|title|description|image)"[^>]*>\s*/gi,'');
const esc=(v:string)=>v.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function meta(route:string){
  const tool=TOOLS.find(t=>route===`/${t.slug}`); if(tool) return {title:tool.seoTitle,description:tool.metaDescription,canonical:`${base}/${tool.slug}`,type:'website'};
  const cat=Object.values(CATEGORY_META).find(c=>route===`/tools/${c.slug}`); if(cat) return {title:cat.title,description:cat.description,canonical:`${base}/tools/${cat.slug}`,type:'website'};
  const guide=GUIDES.find(g=>route===`/guides/${g.slug}`); if(guide) return {title:guide.title,description:guide.description,canonical:`${base}/guides/${guide.slug}`,type:'article'};
  const fixed:Record<string,[string,string]>={'/':['FreeToolBox – Free Online Tools | Fast, Private & Easy to Use','Fast, private, and free online tools to convert, compress, generate, and format files and data directly in your browser without uploads.'],'/guides':['Guides & Technical Tutorials | FreeToolBox','Read practical technical guides for image compression, QR codes, file conversions and browser tools.'],'/about':['About Us | FreeToolBox','Learn about FreeToolBox and its browser-first utility engineering philosophy.'],'/contact':['Contact Us & Feedback | FreeToolBox','Contact FreeToolBox with feedback, feature requests or issue reports.'],'/privacy-policy':['Privacy Policy | FreeToolBox','Learn how FreeToolBox handles browser-based processing and privacy.'],'/terms':['Terms of Service | FreeToolBox','Review the terms governing use of FreeToolBox.'],'/cookie-policy':['Cookie Policy | FreeToolBox','Learn how FreeToolBox uses local storage and optional analytics preferences.'],'/disclaimer':['Legal Disclaimer | FreeToolBox','Important legal notices for FreeToolBox tools and generated results.']};
  const f=fixed[route]||['Page Not Found | FreeToolBox','The requested FreeToolBox page could not be found.'];
  return {title:f[0],description:f[1],canonical:route==='/'?`${base}/`:`${base}${route}`,type:'website'};
}
for(const route of routes){
  const html=renderToString(React.createElement(App,{initialPath:route}));
  const m=meta(route);
  const schema=route.startsWith('/') ? `\n<script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org','@type':m.type==='article'?'Article':'WebPage',name:m.title,url:m.canonical,description:m.description })}</script>` : '';
  const verification=process.env.VITE_GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${esc(process.env.VITE_GOOGLE_SITE_VERIFICATION)}">` : '';
  const head=`${verification}<title>${esc(m.title)}</title><meta name="description" content="${esc(m.description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${m.canonical}"><meta property="og:type" content="${m.type}"><meta property="og:title" content="${esc(m.title)}"><meta property="og:description" content="${esc(m.description)}"><meta property="og:url" content="${m.canonical}"><meta property="og:image" content="${base}/pwa-512x512.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(m.title)}"><meta name="twitter:description" content="${esc(m.description)}"><meta name="twitter:image" content="${base}/pwa-512x512.png">${schema}`;
  const out=template.replace(/<title>[\s\S]*?<\/title>/,'').replace('</head>',`${head}</head>`).replace('<div id="root"></div>',`<div id="root">${html}</div>`);
  const file=route==='/'?path.join(root,'index.html'):path.join(root,route.replace(/^\//,'').replace(/\/$/,'')||'index.html','index.html');
  fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,out);
}
const notFoundHtml=renderToString(React.createElement(App,{initialPath:'/__404__'}));
const notFoundMeta='<title>Page Not Found | FreeToolBox</title><meta name="description" content="The requested FreeToolBox page could not be found."><meta name="robots" content="noindex, nofollow">';
fs.writeFileSync(path.join(root,'404.html'), template.replace(/<title>[\s\S]*?<\/title>/,'').replace('</head>',`${notFoundMeta}</head>`).replace('<div id="root"></div>',`<div id="root">${notFoundHtml}</div>`));
console.log(`Prerendered ${routes.length} SEO routes plus 404.`);
