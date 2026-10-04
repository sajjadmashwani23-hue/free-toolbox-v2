# FreeToolBox — Publish Checklist (Cloudflare Pages)

## Build
1. `npm install`
2. `npm run build`  (vite build + sitemap + SEO check + prerender of every page)
3. Optional local check: `npm run preview`

## Cloudflare Pages
- Framework preset: None
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION` = `20` (or newer)
- Add your custom domain under Pages > Custom domains.
- `public/_redirects` (legacy /tools/<tool> -> /<tool>) and `public/_headers` (security + caching headers) are copied into `dist` automatically.

## Environment variables (all optional)
- `VITE_GA_MEASUREMENT_ID` — GA4 ID (e.g. G-XXXXXXXXXX). Loads only after the visitor accepts cookies.
- `VITE_GOOGLE_SITE_VERIFICATION` — Search Console token.
- `VITE_ADSENSE_CLIENT_ID` + 4 slot IDs — set only after AdSense approval.

## Google Search Console
Deploy, verify the property, then submit `https://freetoolbox.app/sitemap.xml`.

## Canonical URLs
Public tool URLs are `/<tool-slug>`. Legacy `/tools/<tool-slug>` URLs redirect (301) via `_redirects`. Category URLs use `/tools/<category-slug>`.

## Adding a new tool
1. Add it to `src/data/toolsData.ts` (+ keywords in `seoKeywords.ts`).
2. Add a lazy import and route line in `src/App.tsx`.
3. Add a `/tools/<slug> /<slug> 301` line in `public/_redirects`.

## Changing the domain
`https://freetoolbox.app` is hardcoded in: index.html, scripts/prerender.ts, scripts/generate-sitemap.ts, src/utils/seo.ts, src/App.tsx, public/robots.txt. Replace it in all of them.
