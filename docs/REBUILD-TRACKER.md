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
- [ ] **M2 — Dashboard rebuild:** responsive bento dashboard, clear hierarchy, navigation states, light/dark themes and mobile checks. In progress: data-driven task completion percentage and recent local activity widgets added on `rebuild-v1-foundation`; mobile visual QA remains outstanding.
- [ ] **M3 — Core modules:** type-specific create/edit/complete/reopen workflows and validation. Partial: task priority, issue category, and task/issue complete/resolve controls implemented; edit workflows and deeper validation remain.
- [ ] **M4 — Search and capture:** authorised-scope search in the preview, record selection, quick-capture type selection and safe backup/import validation. Partial: local search matches category/priority; quick capture offers record types; backup import has schema/size/count checks.
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

**Latest batch (2026-10-25):** added dashboard task-progress and recent-activity widgets, task priority and issue category fields, search parity for category/priority, backup preservation of these fields, and generic record edit/save/cancel controls. Added Node regression tests for form controls, edit hooks, dashboard hooks, bounded backup import, mobile styling, and local record validation/deletion safeguards. Latest GitHub Actions regression run is pending at the time of this update; these checks do not prove full browser-level behavior. See the isolated review branch and PR #1 before any merge.

**Current next action:** inspect latest automated results, expand automated behavior tests, and continue the task/issue workflow before mobile visual QA.
