# AGENTS.md

Static HTML landing page (no build, no JS framework, no tests).

## Structure
- `index.html` — Spanish page (default language)
- `en/index.html` — English page, mirrors the Spanish one; content changes must be applied to both
- `assets/` — `styles.css`, `script.js` (FAQ accordion only; all other motion is CSS), images
- `sitemap.xml`, `robots.txt` — reference the placeholder domain `https://muralla-ia.example/`

## Conventions and gotchas
- The Spanish page (`lang="es"`) is the source of truth; `en/index.html` is a translation. Keep nav anchor ids, section structure, and copy in sync when editing.
- All asset references from `en/` use `../assets/...`; keep paths relative, never absolute.
- `favicon-32.png` and `ageinglab-logo.png` are referenced in both pages but do not exist in `assets/` — do not "fix" references by removing them; flag the missing assets instead.
- Both pages carry a JSON-LD `ProfessionalService` `<script>` block in the head; keep it in sync (URL, locale, og-cover) when editing either page's head.
- Fonts are loaded from Google Fonts (Fraunces, IBM Plex Sans, IBM Plex Mono) via `styles.css`/inline link; don't add new font families without updating both pages.

## Verification
- Open `index.html` and `en/index.html` in a browser; there is no lint/test tooling in this repo.
- Check FAQ accordion (only JS) and that all anchor links resolve in both pages.
