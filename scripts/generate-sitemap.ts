import fs from 'node:fs';
import { TOOLS } from '../src/data/toolsData';
import { GUIDES } from '../src/data/guidesData';
import { CATEGORY_META } from '../src/data/seoKeywords';
const base='https://freetoolbox.app';
const urls = [
  {path:'/', priority:'1.0', freq:'daily'},
  ...TOOLS.map(t=>({path:`/${t.slug}`,priority:'0.9',freq:'weekly'})),
  ...Object.values(CATEGORY_META).map(c=>({path:`/tools/${c.slug}`,priority:'0.8',freq:'weekly'})),
  {path:'/guides',priority:'0.8',freq:'weekly'},
  ...GUIDES.map(g=>({path:`/guides/${g.slug}`,priority:'0.7',freq:'monthly'})),
  ...['/about','/contact','/privacy-policy','/terms','/cookie-policy','/disclaimer'].map(path=>({path,priority:'0.4',freq:'monthly'})),
];
const today=new Date().toISOString().slice(0,10);
const body=urls.map(u=>`  <url>\n    <loc>${base}${u.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n');
fs.writeFileSync('public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
console.log(`Generated sitemap with ${urls.length} URLs.`);
