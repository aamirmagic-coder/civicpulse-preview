# CivicPulse Rebuild Tracker

**Status:** In progress  
**Scope:** Isolated public preview only  
**Last inspected:** 2026-10-25

## Confirmed code audit

- [x] Read `docs/MASTER-PRODUCT-SPEC.md`.
- [x] Read `docs/QA-FLAG-REGISTER.md`.
- [x] Inspected `index.html`, `app.js`, `styles.css`, and `.github/workflows/pages.yml`.
- [x] Confirmed this preview uses browser `localStorage`; it is not cross-device persistence and must not store sensitive resident, political, or financial records.
- [x] Confirmed the area-intelligence/map is a placeholder, not live map data.
- [x] Confirmed the activity log is local and not a tamper-proof audit log.
- [x] Confirmed module descriptions acknowledge generic/local workflows, but the current UI does not meet the full module specification.
- [x] Confirmed GitHub Pages workflow deploys the frontend-only preview.

## Rebuild milestones

- [ ] **M1 — Audit controls and workflows:** inventory all buttons, navigation paths, forms, validation and current storage behavior.
- [ ] **M2 — Dashboard rebuild:** responsive bento dashboard, clear hierarchy, navigation states, light/dark themes and mobile checks.
- [ ] **M3 — Core modules:** type-specific create/edit/complete/reopen workflows and validation.
- [ ] **M4 — Search and capture:** authorised-scope search in the preview, record selection, quick-capture type selection and safe backup/import validation.
- [ ] **M5 — Automated QA:** routes, controls, forms, mobile overflow, data handling and public/private boundary checks.
- [ ] **M6 — Deployment verification:** verify the deployed version and record exact commit + test results.
- [ ] **M7 — Backend readiness:** separately assess authentication, role enforcement and cross-device persistence; do not claim these from frontend-only checks.

## Hard constraints

- No Vercel.
- Do not alter protected V10.5 baseline or original repository main.
- No production database, credentials, migrations or real resident records in this preview.
- No political targeting or fundraising use of resident service-complaint records.
- Public map must not reveal reporter identities/contact details; do not fabricate map data.
- Free-tier/browser-native only; no paid fallback.
- A successful deploy is not proof the product is fixed.

## How to interact and track

1. **This file is the public checklist:** `docs/REBUILD-TRACKER.md`.
2. **Use the GitHub repository Discussions/issues if enabled;** if GitHub Issues are disabled, add requirements or bugs as a commit/PR comment or send them in this CivicPulse chat.
3. In chat, send `CivicPulse status` to request a progress report, or `CivicPulse next: [task]` to reprioritise the next work batch.
4. Each completed milestone must name its commit, tests actually run, and known gaps. Do not mark a milestone complete on deployment status alone.

**Current next action:** complete the control/workflow inventory, then make a substantial dashboard + interaction change on an isolated rebuild branch.
