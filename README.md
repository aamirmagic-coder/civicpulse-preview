# SUKUMA! — Community Accountability Workspace

**Status:** Public frontend preview and design-system foundation; not a production municipal case-management system.

SUKUMA! replaces the CivicPulse identity for this preview. The supplied original symbol is included unmodified as a symbol-only asset. The lockup proof artwork remains review-only and is not used as a final logo.

## What's included
- Mobile-first, responsive frontend with light/dark theme support.
- Foundation CSS tokens and explicit provisional colour status.
- Montserrat headings and Inter body text (network fonts with system fallbacks).
- Existing local-first workflows retained; legacy browser-storage keys and backup format remain compatible.
- Accessibility guardrails for visible focus, reduced motion, and mobile target sizing.
- Automated static smoke checks and CI workflow.

## Important limitations
- This is a browser-local preview. It does not provide verified authentication, server-side role enforcement, secure cross-device persistence, or a tamper-proof audit trail.
- Do not enter sensitive resident, political, health, financial, or other special-category information.
- Issue entries are not sent to a municipality and are not proof of official submission or resolution.
- AI remains off until deliberately configured; never put production credentials in this public preview.
- WhatsApp actions only prepare a draft for a person to review and send; external messages are never sent automatically.
- The logo and exact official brand colour values remain subject to verification against the supplied master artwork. Do not treat provisional UI colours as final brand approval.

## Development checks
Run `node --test tests/*.test.js` and `node --check app.js`. The GitHub Actions workflow runs both checks on pushes and pull requests.
