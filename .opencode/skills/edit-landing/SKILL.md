---
name: edit-landing
description: Edit copy, sections, nav links, or layout of the IA Local landing page while keeping the Spanish and English pages in sync
metadata:
  project: ia-local-landing-page
---

## What I do
Apply changes to the static landing page and keep the two language pages consistent.

## Workflow
1. `index.html` (Spanish, `lang="es"`) is the source of truth. Make the change there first.
2. Apply the equivalent change to `en/index.html`, translated to English.
3. Keep in sync:
   - Section structure and order (hero, problema, como-funciona, proceso, cumplimiento, precios, preguntas, contacto)
   - Nav anchors: each page uses its own localized anchor ids (es `#como-funciona`, `#cumplimiento`, `#precios`, `#preguntas`, `#contacto`; en `#how-it-works`, `#compliance`, `#pricing`, `#faq`, `#contact`). Both must point to sections that actually exist.
   - Head meta: title, description, og:*, twitter:*, canonical, hreflang alternates. EN page uses `../assets/og-cover-en.png` and canonical `https://muralla-ia.example/en/`.
   - The JSON-LD `ProfessionalService` block in each head (URL and inLanguage differ per page).
   - Any new class names must exist in `assets/styles.css`.
4. Asset paths from `en/index.html` must stay relative: `../assets/...`. Never use absolute paths or `assets/...` from the en page.

## Gotchas
- `assets/favicon-32.png` and `assets/ageinglab-logo.png` are referenced but do not exist in `assets/`. Do not remove the references to "fix" this; flag the missing files to the user instead.
- All motion is CSS; `assets/script.js` only handles the FAQ accordion. Do not add JS for animations.
- There is no build step, linter, or test suite. Verify by opening both pages in a browser and checking anchors resolve.
- Do not change the placeholder domain `https://muralla-ia.example/` unless the user explicitly provides a real domain; if they do, update `index.html`, `en/index.html`, `sitemap.xml`, and `robots.txt` together.
