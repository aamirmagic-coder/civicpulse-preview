# Sukuma! Design System Foundation — Preview

**Status:** Draft for visual review; palette aligned to the supplied DOCX reference  
**Branch:** `preview/sukuma-dashboard-foundation`  
**Scope:** Preview-only dashboard page; existing `index.html`, `styles.css`, and `app.js` remain unchanged.

## Brand and implementation guardrails

- Preserve the existing Sukuma! logo asset and current app tokens.
- Typography: Montserrat for headings, Inter for body/UI text.
- Working preview palette follows the supplied DOCX reference: brand deep teal `#0F3D4A`, navy-teal `#0B333F`, primary CTA orange `#F06724`, active cyan `#007D9B` (use for active/link accents where appropriate), canvas `#F4F7F9`, white surface `#FFFFFF`, text `#1E293B`, muted `#64748B`, border `#E2E8F0`.
- Status colours follow the DOCX reference: in progress `#E1F5FE` / `#0288D1`; assigned `#EDE7F6` / `#673AB7`; open/action required `#FBE9E7` / `#E64A19`; resolved `#E8F5E9` / `#2E7D32`.
- Typography remains Montserrat headings and Inter body, as established in the Sukuma! project decisions. The DOCX’s alternate font mention does not override that confirmed choice.
- Logo folder contains separate horizontal light/dark proof assets; use the existing supplied logo asset in this preview and do not redraw or recolour it. The folder labels the current logo exports as review proofs, so do not call them final masters.
- Responsive layout supports desktop navigation and a fixed mobile navigation bar.
- Keyboard focus indicators, skip link, semantic landmarks, labels, status text, and reduced-motion preference are included.
- The dashboard is a visual prototype. All sample counts, case IDs, names, status, and activity are fictional placeholders and must not be treated as real records.
- No resident data, external communications, backend integration, or persistence is implemented.

## Preview

Open `preview.html` on the branch or use the GitHub Pages preview URL if Pages serves the branch/file in your current configuration. This page references the existing `assets/sukuma-horizontal-light.png` logo and Google Fonts.

## Review questions before production integration

1. Compare final brand token values with the owner-confirmed DOCX and brand guide before production integration.
2. Confirm the real workflow/status taxonomy for municipal issues and follow-up intervals.
3. Confirm which modules belong on the first dashboard and which metrics can be sourced from verified data.
4. Confirm approved icon library; the current preview uses lightweight text glyphs to avoid introducing a dependency.
5. Validate contrast and touch targets in browser at mobile and desktop widths before merging.

## Files in this change

- `preview.html` — standalone responsive dashboard design preview.
- `docs/sukuma-design-system-foundation.md` — provisional token and review notes.
