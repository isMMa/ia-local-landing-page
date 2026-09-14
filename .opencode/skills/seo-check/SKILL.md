---
name: seo-check
description: Audit or update SEO/meta on the IA Local landing page (tags, JSON-LD, sitemap, robots, canonicals, og-cover images)
metadata:
  project: ia-local-landing-page
---

## What I do
Audit or update the SEO surface of the landing page across all relevant files.

## Files in scope
- `index.html` and `en/index.html` — `<head>` meta only (title, description, robots, canonical, hreflang alternates, og:*, twitter:*, favicon links, JSON-LD block)
- `sitemap.xml` — URLs for `/` and `/en/` with xhtml:link alternates
- `robots.txt` — sitemap URL
- `assets/og-cover.png` (es) and `assets/og-cover-en.png` (en) — the og/twitter images

## Invariants
- The domain `https://muralla-ia.example/` is a placeholder. Do not replace it unless the user gives a real domain; if they do, update all four files (both HTML pages, sitemap.xml, robots.txt) in one pass.
- Canonicals: es → `https://muralla-ia.example/`, en → `https://muralla-ia.example/en/`.
- og:image: es → `.../assets/og-cover.png`, en → `.../assets/og-cover-en.png`. The EN page must never reference the ES cover.
- `hreflang` alternates must list both `/` (es) and `/en/` (en) plus `x-default` on every page and in `sitemap.xml`.
- Each page carries a JSON-LD `ProfessionalService` block; keep `url` per-language and `inLanguage: ["es","en"]`.
- `og:locale` is `es_ES` on the es page and `en_US` on the en page; keep `og:locale:alternate` pointing to the other.

## Verification
- Grep both HTML files for `example` to confirm the placeholder domain is used consistently (or the new real domain everywhere).
- Confirm no meta tag references a missing asset: only `og-cover.png`, `og-cover-en.png`, `favicon-64.png` exist in `assets/`; `favicon-32.png` and `ageinglab-logo.png` are known-missing — flag, don't remove.
