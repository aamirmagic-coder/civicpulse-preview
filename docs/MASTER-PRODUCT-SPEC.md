# CivicPulse — Master Product Specification
Version: 1.0 (recovered baseline)
Status: Working specification for the public frontend preview; not production approval.

## 1. Product identity
- Name: CivicPulse
- Tagline: Community Intelligence
- Source of truth: private development repository; this repository is a frontend-only preview.
- V10.5 Final remains a protected baseline. Do not overwrite it.
- Do not merge this preview into the original repository's main branch or alter production services without explicit approval.

## 2. Visual design
- Mobile-first, premium SaaS command centre; desktop remains responsive.
- Midnight canvas #0B0F19, card surfaces #151D2A, borders #26334D.
- Indigo #6366F1 for primary actions; emerald #10B981 for success/active states.
- Main text #F9FAFB; secondary text #9CA3AF or an accessible equivalent.
- 16px card radius, restrained ambient shadows, clear hierarchy and high contrast.
- Header includes logo, search, theme toggle and account controls.
- The logo artwork in the source SVG is used in both themes: dark-backed mark in dark mode and light-backed mark in light mode.
- Dashboard uses a bento layout, an executive briefing, a prominent “Capture Something” action, horizontal secondary navigation and a floating bottom dock.
- Bottom dock: Dashboard, Tasks, Issues, More. Secondary navigation includes Finance, Knowledge Base, People, Audit and Settings.
- Use consistent functional icons; avoid clutter and repeated identical tiles.

## 3. Dashboard and interaction contracts
- Executive briefing: summarise open tasks, unresolved issues, community alerts/activity where verified data exists.
- Task cards open Tasks; issue cards open Issues; project/person/team/finance cards open their relevant modules.
- Capture Something opens a choice of record type and then a type-appropriate form.
- Search only returns records the current user is authorised to access and opens the selected record.
- Area Intelligence must clearly indicate when map data is unavailable. Never fabricate a live map or reports.
- Backup controls explain what is exported/imported; validate a backup before replacing local data.
- Theme choice persists locally and the correct logo variant follows the selected theme.

## 4. Modules and intended behaviour
- Dashboard: operational summaries, progress, alerts and recent activity.
- Tasks: create, assign, prioritise, schedule, update, complete and reopen.
- Issues: categorise, record location/evidence as appropriate, track status and follow-up. Saving an issue must not mark it resolved.
- Projects: objectives, milestones, deadlines, progress and outcomes.
- People: authorised contact records with purpose limitation and privacy controls.
- Team: members, roles, responsibilities and field coordination.
- Calendar: events, dates and reminders.
- Fundraising: targets, contributions/sources and progress; no payment processing unless separately approved.
- Expenses: amounts, category, date, evidence and approval status where applicable. Keep separate from Fundraising.
- Finance: aggregate fundraising and expenses without duplicating their underlying records.
- Birthdays: authorised birthday reminders.
- Knowledge Base: searchable notes and reference documents.
- Audit Log: relevant activity history. Browser-only entries are not a tamper-proof security audit trail.
- Settings: preferences, access, integrations, privacy and backup controls.
- Civic AI: optional; off until configured, free-tier only, no paid fallback. Access restricted to Owner/Main User unless deliberately configured otherwise. Never use production credentials in the public preview.
- Voice: device/browser-native where available; explain that dictation may use a browser speech service.
- WhatsApp: opens a prefilled draft for a person to review and send; no automated messaging.

## 5. Roles and access
Roles in the product model: Owner, Super Admin, Admin, Manager, Field Officer, Fundraising Officer, Team Member and Viewer.
UI role selection alone is not security; permissions must be enforced server-side in any connected production system. Public users may access explicitly public modules without an account, but private records remain protected.

## 6. Privacy and public portal
- Resident service-complaint data is for processing and follow-up only; never repurpose it for political targeting or fundraising.
- Collect only necessary information and use purpose-specific case contact fields.
- A public issue map, when approved and implemented, shows only approved unresolved issues and no reporter personal information.
- Keep the public issue intake/privacy boundary intact.
- Current preview uses local browser storage, is not encrypted or synchronised, and must not contain sensitive resident, political or financial data.

## 7. Cost and reliability
- Free-tier and browser-native services only unless explicit approval is given.
- No automatic paid fallback. Degrade gracefully when a free allowance is exhausted.
- Keep backups portable and validate imports before replacing data.
- Offline/PWA shell should cache only app assets, not sensitive records.
- No Vercel. Public preview hosting is GitHub Pages.

## 8. Red-flag and orange-flag lists — retrieval status
The exact historical CivicPulse/CIVICOS “red flag list” and “orange flag list” were not present in the searchable project context or recovered files. Older AamirOS files show red/orange status UI elements, but do not establish the intended CivicPulse list contents. An electoral-party-agent manual contains separate election-irregularity red flags; those are not assumed to be the CivicPulse product lists. Do not silently substitute one list for the other.
- Red list: pending recovery of the exact original entries.
- Orange list: pending recovery of the exact original entries.
- Until recovered, record proposed product defects in the new QA register as provisional, not as historical user-approved flags.

## 9. Acceptance checklist
- [ ] Dark and light themes persist across reloads and show the correct logo.
- [ ] Mobile layout works without horizontal page overflow; quick-nav can scroll horizontally.
- [ ] Bottom navigation and dashboard cards open the correct modules.
- [ ] Every visible button has a working action or a clear disabled/unavailable state.
- [ ] Each module has type-appropriate fields and validation before production.
- [ ] Task completion updates counters and activity history.
- [ ] Issue creation preserves unresolved status until explicitly changed by an authorised user.
- [ ] Search respects permissions.
- [ ] Export/import handles malformed files safely and does not silently discard fields.
- [ ] Role permissions are server-enforced in connected deployments.
- [ ] Public issue views expose no personal reporter details.
- [ ] No production database, credentials or paid service is used by this preview.
- [ ] PWA install, offline shell and Android speech behaviour are tested on device.
