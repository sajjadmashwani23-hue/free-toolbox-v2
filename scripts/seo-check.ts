import { TOOLS } from '../src/data/toolsData';
import { GUIDES } from '../src/data/guidesData';
import { CATEGORY_META, TOOL_KEYWORDS } from '../src/data/seoKeywords';
import fs from 'node:fs';
 
const errors: string[] = [];
const slugs = new Set<string>();
for (const tool of TOOLS) {
  if (slugs.has(tool.slug)) errors.push(`Duplicate tool slug: ${tool.slug}`);
  slugs.add(tool.slug);
  if (!tool.seoTitle || tool.seoTitle.length < 30 || tool.seoTitle.length > 70) errors.push(`${tool.slug}: SEO title should be 30–70 chars`);
  if (!tool.metaDescription || tool.metaDescription.length < 80 || tool.metaDescription.length > 170) errors.push(`${tool.slug}: meta description should be 80–170 chars`);
  if (!tool.h1) errors.push(`${tool.slug}: missing H1`);
  if (tool.howToSteps.length < 2) errors.push(`${tool.slug}: insufficient HowTo steps`);
  if (tool.faqs.length < 3) console.warn(`WARNING ${tool.slug}: only ${tool.faqs.length} FAQ entries (3+ recommended)`);
  if (!TOOL_KEYWORDS[tool.slug]) errors.push(`${tool.slug}: missing keyword map`);
  if (tool.relatedToolSlugs.some((slug) => !slugs.has(slug) && !TOOLS.some(t => t.slug === slug))) errors.push(`${tool.slug}: related tool slug does not exist`);
}
for (const guide of GUIDES) {
  if (!guide.slug || !guide.title || !guide.description) errors.push(`Guide ${guide.slug || '(unknown)'} missing SEO fields`);
}
for (const [key, meta] of Object.entries(CATEGORY_META)) {
  if (!meta.slug || !meta.name || !meta.description) errors.push(`Category ${key} missing metadata`);
  const categoryTools = TOOLS.filter(t => t.category === key);
  if (!categoryTools.length) errors.push(`Category ${key} has no tools`);
}
if (!fs.existsSync('public/robots.txt')) errors.push('Missing public/robots.txt');
if (!fs.existsSync('public/sitemap.xml')) errors.push('Missing public/sitemap.xml');
 
if (errors.length) { console.error(`SEO validation failed with ${errors.length} issue(s):\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`SEO validation passed: ${TOOLS.length} tools, ${GUIDES.length} guides, ${Object.keys(CATEGORY_META).length} categories.`);
 
