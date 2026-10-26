# Sukuma! Design System Foundation — Preview

**Status:** Draft for visual review  
**Branch:** `preview/sukuma-dashboard-foundation`  
**Scope:** Preview-only dashboard page; existing `index.html`, `styles.css`, and `app.js` remain unchanged.

## Brand and implementation guardrails

- Preserve the existing Sukuma! logo asset and current app tokens.
- Typography: Montserrat for headings, Inter for body/UI text.
- Current preview tokens are carried forward from the inspected codebase: brand `#175D69`, deep brand `#104650`, accent `#C96F43`, canvas `#F6F0E7`, surface `#FFFCF7`, text `#202A2E`, muted `#52616A`, border `#D8CEC0`.
- Do not replace these with colours found in the reference DOCX until the official brand guide is confirmed.
- Responsive layout supports desktop navigation and a fixed mobile navigation bar.
- Keyboard focus indicators, skip link, semantic landmarks, labels, status text, and reduced-motion preference are included.
- The dashboard is a visual prototype. All sample counts, case IDs, names, status, and activity are fictional placeholders and must not be treated as real records.
- No resident data, external communications, backend integration, or persistence is implemented.

## Preview

Open `preview.html` on the branch or use the GitHub Pages preview URL if Pages serves the branch/file in your current configuration. This page references the existing `assets/sukuma-horizontal-light.png` logo and Google Fonts.

## Review questions before production integration

1. Confirm the official brand guide and token values.
2. Confirm the real workflow/status taxonomy for municipal issues and follow-up intervals.
3. Confirm which modules belong on the first dashboard and which metrics can be sourced from verified data.
4. Confirm approved icon library; the current preview uses lightweight text glyphs to avoid introducing a dependency.
5. Validate contrast and touch targets in browser at mobile and desktop widths before merging.

## Files in this change

- `preview.html` — standalone responsive dashboard design preview.
- `docs/sukuma-design-system-foundation.md` — provisional token and review notes.
