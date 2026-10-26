import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const worker = await readFile(new URL("../src/index.js", import.meta.url), "utf8");
const migration = await readFile(new URL("../migrations/001_create_casework.sql", import.meta.url), "utf8");

test("auth requires a Bearer token and verified issuer, audience and JWKS", () => {
  assert.match(worker, /authorization/);
  assert.match(worker, /createRemoteJWKSet/);
  assert.match(worker, /issuer: env\.NEON_AUTH_ISSUER/);
  assert.match(worker, /audience: env\.NEON_AUTH_AUDIENCE/);
  assert.match(worker, /algorithms: \["RS256", "ES256"\]/);
  assert.match(worker, /payload\.sub/);
});

test("owner identity comes from the verified token, not request data", () => {
  assert.match(worker, /return \{ actorId: payload\.sub \}/);
  assert.match(worker, /WHERE owner_id = \$1/);
  assert.match(worker, /WHERE id = \$1 AND owner_id = \$2/);
  assert.doesNotMatch(worker, /body\.ownerId|body\.actorId/);
});

test("write payloads use strict allowlists and enforce field lengths", () => {
  assert.match(worker, /CREATE_FIELDS = new Set\(\["title", "details", "category", "priority"\]\)/);
  assert.match(worker, /UPDATE_FIELDS = new Set\(\["status", "note"\]\)/);
  assert.match(worker, /textField\(body\.title, "Title", 180, true\)/);
  assert.match(worker, /textField\(body\.details, "Details", 2000\)/);
  assert.match(worker, /textField\(body\.note, "Note", 240\)/);
  assert.match(worker, /MAX_BODY = 8192/);
});

test("case and event writes use the same transaction client", () => {
  assert.match(worker, /const client = await pool\.connect\(\)/);
  assert.match(worker, /await client\.query\("BEGIN"\)/);
  assert.match(worker, /await client\.query\("COMMIT"\)/);
  assert.match(worker, /await client\.query\("ROLLBACK"\)/);
  assert.match(worker, /client\.release\(\)/);
  assert.match(worker, /INSERT INTO public\.sukuma_case_events/);
});

test("history reads are owner-scoped and are not client-writeable", () => {
  assert.match(worker, /WHERE case_id = \$1 AND owner_id = \$2/);
  assert.doesNotMatch(worker, /UPDATE public\.sukuma_case_events|DELETE FROM public\.sukuma_case_events/);
});

test("CORS is exact-origin allowlisted and responses are not cached", () => {
  assert.match(worker, /allowed\.includes\(origin\)/);
  assert.match(worker, /cache-control": "no-store"/);
  assert.doesNotMatch(worker, /access-control-allow-origin": "\*"/);
});

test("database migration constrains statuses and categories", () => {
  assert.match(migration, /owner_id text NOT NULL/);
  assert.match(migration, /CHECK \(status IN/);
  assert.match(migration, /CHECK \(category IN/);
  assert.match(migration, /FOREIGN KEY|REFERENCES public\.sukuma_cases/);
});
