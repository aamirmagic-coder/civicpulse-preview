# CivicPulse Control and Workflow Audit

Scope: `rebuild-v1-foundation` branch, frontend-only preview. This is a code inspection, not browser-based end-to-end testing.

## Confirmed current implementation gaps

| Area | Observed behavior | Risk / next action |
|---|---|---|
| Global search | Previous handler sent dashboard searches to Tasks and searched only the current module. | Updated on rebuild branch to search across local collections and show a result panel. Needs runtime testing. |
| Quick capture | Previously always created a Task, regardless of what the user wanted to capture. | Updated on rebuild branch to let the user select a record type. Still uses simple prompts and should be replaced with a polished accessible dialog later. |
| Issue lifecycle | Issue records could be deleted but did not have a Resolve/Reopen action in the list. | Updated on rebuild branch with a local resolve/reopen control. Needs behavior testing. |
| Module data | Most modules use a shared generic title/details/date/amount form. | Replace with type-specific fields and validation in planned module batches. |
| Persistence | Uses browser localStorage. | Local to one browser/device; not secure storage, not cross-device sync. Never put sensitive resident, political, or financial records in the public preview. |
| Authorization | No authenticated multi-role security boundary in the public frontend. | UI controls cannot substitute for server-side auth/RBAC. Production blocker. |
| Map | Explicit placeholder, no live data. | Do not describe as live. Any future public map needs a server-side privacy filter. |
| Audit | Local activity array in browser storage. | Useful for local history only; not tamper-proof. |
| Backup/import | Export and import exist; import validates a format and asks before replacing local state. | Needs automated tests for malformed/oversized data and rollback behavior. |
| AI | Optional Worker connection; off by default; user-configured endpoint. | Keep isolated dev Worker only, free allowance only, no production credentials and no paid fallback. |
| Deploy | GitHub Pages workflow publishes static assets from main. | Successful deploy proves publication only, not application behavior. |

## Rebuild-branch changes in this batch

- Cross-module local search results panel.
- Quick capture supports Task, Issue/field report, Field note, Project, Person/contact, Fundraising record and Expense.
- Issue records gain Resolve/Reopen action.
- Search panel styling.
- A GitHub Actions workflow checks JavaScript syntax, required hooks and HTML parsing.

## Test status

- [x] Code/specification inspected.
- [x] Branch changes present in GitHub.
- [ ] Automated workflow result not yet observed.
- [ ] Browser interaction tests not yet run.
- [ ] Mobile device visual QA not yet run.
- [ ] Backend security/persistence not implemented by this frontend batch.
