# SUKUMA! backend integration security review

**Review date:** 26 October 2026  
**Scope:** Read-only inspection of the existing Phoenix preview Worker and Neon item schema. No Worker configuration, secrets, database rows, or production resources were changed.

## Findings

### Available infrastructure
- The existing Phoenix preview Worker exposes /v1/items GET/POST and item DELETE routes.
- Item reads and writes filter by the verified ownerId; the API derives this from a verified Neon Auth user ID rather than trusting a client-supplied owner.
- The Worker sets a session cookie with HttpOnly, Secure, SameSite=Lax, and a path scope.
- The Neon public.jarvis_items table already supports item_type='issue', title, details, status, due date, source URL and JSON metadata.
- public.jarvis_audit_log exists, but it must not be assumed to be a tamper-proof or legally sufficient municipal case audit trail.

### Integration blockers
- The current SUKUMA! preview stores its records in browser local storage and does not implement a verified Neon Auth user session.
- The current optional AI connection's password login is not, by itself, proof that the browser has the verified Neon Auth session required by the item routes. Do not wire casework to these routes until the intended sign-in flow is confirmed and tested.
- The generic item API accepts arbitrary status strings and arbitrary JSON metadata. The SUKUMA! client must validate issue status/category/priority and keep private resident data out of metadata unless a reviewed data model and access policy explicitly require it.
- A generic item record and generic audit-log entry do not yet provide an explicit, transactionally linked case-history model with verified actor identity, immutable event semantics, retention rules, and appropriate export/deletion controls.
- Worker CORS and the deployed browser-origin relationship have not been verified in a real browser session.

## Safe next implementation
1. Choose the intended identity flow for the current single owner and verify a fresh authenticated session end-to-end.
2. Define a case-specific API contract with strict allowlists for status, category, priority, field lengths, and metadata.
3. Add a dedicated case-history record model or another explicitly reviewed append-only history design; do not represent the local preview history as an official audit log.
4. Test unauthenticated access, cross-owner access, invalid status values, malformed input, failed writes, and browser refresh persistence against a non-production environment.
5. Only then connect the casework UI to persistent storage.

## Explicit non-actions
- No Worker was deployed or edited.
- No database schema or data was changed.
- No secrets, tokens, passwords, or connection strings are included in this document.