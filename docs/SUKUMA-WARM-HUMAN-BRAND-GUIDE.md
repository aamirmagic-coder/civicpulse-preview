# SUKUMA! Brand Guide — Warm & Human

**Status:** Draft for review · Palette direction approved · Production release gates remain open  
**Audience:** Product design, frontend implementation, QA  
**Scope:** Brand and interface guidance only. This document does not authorize application changes, deployments, database changes, or external communications.

---

## 1. Brand direction

SUKUMA! is a South African municipal feedback, complaint-resolution, and accountability platform. The experience should feel **clear, trustworthy, human, and action-oriented**. Residents should be able to understand what is happening, what needs attention, and what comes next without needing to decode the interface.

### Principles
- **Human first:** Plain language, respectful tone, no blame.
- **Accountability visible:** Show status, ownership, history, and next steps when verified data exists.
- **Clarity over decoration:** Strong hierarchy, purposeful colour, restrained motifs.
- **Accessible by default:** Keyboard access, visible focus, readable contrast, scalable type, and status labels that do not rely on colour alone.
- **Evidence over assumption:** Never fabricate resident cases, metrics, timelines, or resolution claims.

## 2. Approved working palette

The following **Warm & Human** direction is approved for design exploration. Exact logo-asset sampling, component-state mapping, and contrast validation are still **Verify** items. Do not describe the palette as fully WCAG-validated until checks are documented.

### Light theme

| Token | Value | Intended use |
|---|---|---|
| Primary Petrol Blue | `#175D69` | Primary actions, key navigation, emphasis |
| Secondary Slate Blue | `#526D82` | Secondary actions, supporting information |
| Accent Burnt Orange | `#C96F43` | Warm emphasis; use sparingly |
| Background Warm Sand | `#F6F0E7` | Main page background |
| Surface Pale Cream | `#FFFCF7` | Cards, panels, elevated content |

### Dark theme

| Token | Value | Intended use |
|---|---|---|
| Background | `#182229` | Main page background |
| Surface | `#202B32` | Cards and panels |
| Elevated Surface | `#293740` | Popovers and elevated content |
| Text | `#F6F2EB` | Primary text |
| Muted Text | `#C0C8CB` | Supporting text; validate per use |
| Light Primary Accent | `#78C3C8` | Primary accent on dark surfaces |
| Light Secondary Accent | `#A4B6C8` | Secondary accent on dark surfaces |
| Light Warm Accent | `#E99770` | Warm emphasis on dark surfaces |

### Colour use rules
- Use petrol blue for the primary action and navigation hierarchy.
- Use burnt orange as an accent, not as the only indicator of urgency or failure.
- Reserve red/error, green/success, amber/warning, and neutral/information semantics for clearly documented status tokens; their exact values are **Verify**.
- Every status must include text or an accessible name, not colour alone.
- Check each foreground/background pair in its actual component and state. Minimum WCAG 2.2 AA targets: **4.5:1 for normal text**, **3:1 for large text**, and **3:1 for relevant non-text UI boundaries and indicators**.
- Do not infer colours from screenshots when original logo assets are available.

## 3. Typography

- **Headings:** Montserrat
- **Body, labels, controls, and data:** Inter
- Use system fallbacks if web fonts fail to load.
- Avoid long all-caps strings; preserve readable line length and clear sentence case.

### Suggested type scale

| Token | Size | Typical use |
|---|---:|---|
| `text-xs` | 12 px | Metadata, timestamps (not for essential long-form content) |
| `text-sm` | 14 px | Supporting labels |
| `text-base` | 16 px | Default body and form controls |
| `text-lg` | 20 px | Card headings and lead text |
| `heading-sm` | 24 px | Section headings |
| `heading-md` | 32 px | Page headings |
| `heading-lg` | 40 px | Feature headings |
| `display` | 48 px | Occasional campaign/landing-page display use |

This scale is a starting point; confirm responsive wrapping and zoom behaviour in real screens.

## 4. Logo and brand assets

**Do not redraw, stretch, distort, recolour, crop, or apply unapproved effects to the supplied logo artwork.** Preserve original files unchanged.

Use the supplied variants where appropriate:
- Horizontal logo for wide headers and suitable desktop contexts.
- Square mark for app-icon or compact contexts.
- Light/dark variants only on backgrounds for which they were supplied or explicitly verified.
- Prefer the supplied transparent version when available.
- If a checkerboard is visibly baked into the pixels, remove only that background while preserving the original artwork; inspect the result at multiple sizes.

Asset references supplied for review:
- [Original / watermark logo](https://drive.google.com/file/d/1_so8pm1QrFzp6INcaZeuMmDkoNgP7PDg/view?usp=drivesdk)
- [Square dark](https://drive.google.com/file/d/1eGDLHiMW22vScn-fTxUSWjv23jRWtItj/view?usp=drivesdk)
- [Square light](https://drive.google.com/file/d/1Zj6OB7ZhuellJvJrlCLj0rxqvXURM8zM/view?usp=drivesdk)
- [Horizontal dark](https://drive.google.com/file/d/1tGLedUQCnxtWyek7xQN5IJIcMvvsrEz7/view?usp=drivesdk)
- [Horizontal light](https://drive.google.com/file/d/1K78sQw9DZmU-XFpTA0ERw7UqA6kQafde/view?usp=drivesdk)
- [Current brand guide PDF](https://drive.google.com/file/d/1Uogysds-kxEts-5PIT0cFASX9b7XfpSm/view?usp=drivesdk)

**Verify before production:** compare the live assets with the rendered interface; sample representative colours from the actual artwork; confirm transparency and light/dark suitability. These Drive links are references only; their files have not been verified as downloaded in this task.

## 5. Motifs, iconography, and tiles

- Use phoenix motifs sparingly and at low contrast. They should support brand recognition without competing with case information or calls to action.
- Use one consistent icon family with consistent stroke weight, corner treatment, and optical sizing.
- Standard compact icon tile: **44 × 44 px** tile with a **24 × 24 px** icon, centred. Treat these as design defaults and validate touch target requirements for the surrounding control.
- Use flame tips only for explicitly urgent matters; do not use them as generic decoration or as the only urgency cue.
- Confirmation treatment: white tick inside a blue tile; no flame.
- Keep icon geometry consistent across summary rows, review rows, cards, and detail views.
- Icon-only controls require an accessible name and visible focus state.

## 6. Layout and component foundations

### Spacing scale
Use a consistent 4 px base scale: **4, 8, 12, 16, 24, 32, 40, 48 px**. Prefer tokens over one-off spacing.

### Suggested component defaults
- Card radius: 12–16 px; use one value consistently per component family.
- Buttons and inputs: clear labels, strong focus indication, comfortable spacing, and appropriately sized tap areas.
- Mobile-first layouts: single-column priority on narrow screens; expand to multi-column only when content order and readability remain clear.
- Use cards for case summaries only when they help users scan status, issue, location, last update, and next step.
- Show progress only when it is based on real, defined workflow states. Do not imply percentages or completion where no reliable calculation exists.
- Search: the icon may expand on activation, but keyboard, touch, screen-reader, and focus behaviour must be tested.
- Authentication and install controls must reflect actual application state; never imply a user is signed in or an app is installable without evidence.
- Keep resident complaint handling separate from campaigning and political targeting.

## 7. Status, feedback, and interaction states

Every interactive component should define and test:
- Default
- Hover (where applicable)
- Focus-visible
- Pressed/active
- Disabled
- Loading
- Success
- Error
- Empty state
- Validation/help text where applicable

Use plain-language labels alongside status styling. Make errors actionable, associate validation messages with fields, and move focus appropriately after significant form errors or state changes. Do not use motion as the only feedback; respect reduced-motion preferences.

## 8. Accessibility and responsive QA

Target **WCAG 2.2 AA**.

- Contrast: validate all actual text, icons, borders, and focus indicators against their rendered backgrounds.
- Keyboard: all actions reachable in logical order, with no keyboard traps.
- Focus: visible, not obscured by sticky headers, sheets, or overlays.
- Touch: ensure controls have comfortable target sizes and adequate spacing; aim for 44 × 44 CSS px where practical.
- Text: support browser zoom and text resizing; avoid fixed heights that clip content.
- Semantics: use correct headings, labels, landmarks, button/link semantics, and accessible names.
- Forms: persistent labels, understandable errors, and instructions that do not rely on placeholder text alone.
- Status: never communicate state through colour alone.
- Responsive checks: small Android phone, large phone, tablet, and desktop; portrait and landscape where relevant.
- Test slow loading, empty data, long translated content, and keyboard-only flows.

## 9. Token implementation guidance

When this direction is finalized, express it as named tokens (CSS custom properties or the existing project token mechanism). Keep semantic roles separate from raw palette values. Example naming only:

```css
:root {
  --color-brand-primary: #175D69;
  --color-brand-secondary: #526D82;
  --color-brand-accent: #C96F43;
  --color-background: #F6F0E7;
  --color-surface: #FFFCF7;
  --font-heading: "Montserrat", sans-serif;
  --font-body: "Inter", sans-serif;
}
```

This snippet is illustrative only. **Do not paste it into production until existing tokens and contrast/state mappings have been inspected and approved.** The current repository implementation has not been changed by this document.

## 10. Finalization checklist

- [ ] Review this draft and approve the brand direction.
- [ ] Open and inspect every supplied logo variant; confirm asset dimensions, transparency, and intended background.
- [ ] Sample colours from the actual logo artwork and reconcile any differences with the approved working palette.
- [ ] Test colour contrast for every text/background and relevant UI-state combination.
- [ ] Finalize semantic tokens for text, surfaces, borders, focus, links, and status states.
- [ ] Confirm typography files, weights, loading behaviour, and fallbacks.
- [ ] Validate logo placement at small Android sizes and large desktop sizes.
- [ ] Review keyboard, focus, screen-reader, zoom, reduced-motion, and touch behaviour.
- [ ] Run responsive visual QA on real page components with real data only.
- [ ] Obtain explicit approval before changing application screens, merging a PR, or deploying.

---

**Decision record:** “Warm & Human” palette direction approved by project owner. This guide is a review draft; the colour values, logo treatment, and typography scale are not a substitute for final contrast testing or asset verification.
