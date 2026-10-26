# SUKUMA! case API Worker (preview scaffold)

This Worker is intentionally separate from the static preview. It is **not deployed or connected to the UI**.

## Required configuration — verify before use
- `NEON_DATABASE_URL`: a restricted database role/connection string, not a database-owner credential. Prefer Neon pooled connections or Cloudflare Hyperdrive.
- `NEON_AUTH_JWKS_URL`, `NEON_AUTH_ISSUER`, `NEON_AUTH_AUDIENCE`: exact values from the intended Neon Auth application. The current preview login is not proof of a Neon Auth session.
- `ALLOWED_ORIGINS`: exact approved origins, comma separated.
- Apply `migrations/001_create_casework.sql` only to a development branch after explicit approval.
- Install dependencies and run tests before deployment.

## Routes
- `GET /health` (non-sensitive readiness indicator)
- `GET /v1/cases?limit=25`
- `POST /v1/cases`
- `GET /v1/cases/:uuid`
- `GET /v1/cases/:uuid/history`
- `PATCH /v1/cases/:uuid/status`

All case routes require a Bearer access token verified against configured issuer, audience and JWKS. Owner/actor identity comes only from verified `sub`. Unknown payload keys are rejected; IDs and timestamps are server-generated; request bodies are capped; SQL is parameterized; responses are not cached; cross-origin access is allowlisted.

## Security limitations — must resolve before real data
- Verify the actual Neon Auth token issuer/audience/JWKS and token format against the connected project; these values are intentionally not guessed.
- Configure and verify a restricted database role. This schema alone does not make events tamper-proof; privileged DB operators can still change them. Application role permissions must deny event UPDATE/DELETE.
- Verify concurrency semantics, pagination, rate limiting, CSRF/browser integration, auth expiry/sign-out, retention, export and lawful deletion before production.
- The status API rejects same-status updates but has no transition matrix because product rules are not yet confirmed.
- This is internal casework only, not a public resident intake API or municipal case-management integration.
