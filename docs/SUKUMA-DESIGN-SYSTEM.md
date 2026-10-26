# SUKUMA! Design System Foundation

**Status:** Foundation implemented; official brand validation pending.

## Brand and logo
- Product identity: **SUKUMA!**
- Working line from the supplied guide: **“Stand Up! We build together.”**
- The original symbol must never be redrawn, distorted, stretched, rotated, or recoloured. The current asset is used with `object-fit: contain`.
- The owner-supplied original symbol is included unmodified at `assets/sukuma-symbol-original.png` and used only as the symbol-only mark. Horizontal/stacked lockup proofs remain review-only, not final artwork.
- Horizontal light/dark lockups are preferred; stacked lockup is secondary. Use symbol-only only where the full lockup cannot remain legible.

## Typography
- Product UI headings: Montserrat.
- Body and controls: Inter.
- Current webfont loading is optional; system sans-serif fallbacks remain available offline.
- Final logo-wordmark font is not inferred from the UI font pairing.

## Tokens
- CSS source: `tokens/tokens.css`.
- Light and dark themes share semantic token names.
- Blue and orange values are **provisional placeholders** and must be checked against approved master artwork before production.
- Charcoal/light/text values follow the working guide's explicitly provisional screen previews.
- Orange is reserved for primary actions and highlights; blue is used for focus and supporting accents.

## Accessibility
- Target: WCAG 2.2 AA.
- Keyboard-visible focus is explicit.
- Reduced-motion preference is respected.
- Mobile controls have a 44px minimum target in key header/action paths.
- Automated source checks do not prove contrast conformance; verify final token combinations with a contrast checker and test with keyboard and screen readers.

## Responsive rules
- Android-first mobile layout; fluid content width on larger screens.
- Header search collapses on narrow screens but expands on focus.
- Navigation remains horizontally scrollable where required.
- Content and actions wrap rather than overflow at small widths.

## Data and security boundaries
- The preview is browser-local and is not a secure case-management backend.
- UI role labels are not authorization. Production requires server-side access controls, audit logging, validated APIs, and an approved data-retention/deletion design.
- Resident complaints must not be repurposed for political targeting or campaigning.
- No external message is sent automatically; sharing controls only open a user-reviewed draft.
