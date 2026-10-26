import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest } from "../src/index.js";

const env = {
  ALLOWED_ORIGINS: "https://sukuma.example",
  NEON_AUTH_JWKS_URL: "https://auth.example/.well-known/jwks.json",
  NEON_AUTH_ISSUER: "https://auth.example",
  NEON_AUTH_AUDIENCE: "sukuma-api",
  NEON_DATABASE_URL: "postgresql://unused:unused@localhost/unused"
};

test("health route is a non-sensitive readiness response and does not require DB config", async () => {
  const response = await handleRequest(new Request("https://worker.example/health"), {});
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: "sukuma-case-api", mode: "authenticated-preview" });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("rejects a request from an origin outside the exact allowlist", async () => {
  const response = await handleRequest(new Request("https://worker.example/v1/cases", {
    headers: { origin: "https://evil.example" }
  }), env);
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});

test("returns CORS headers for an allowed preflight without opening a database connection", async () => {
  const response = await handleRequest(new Request("https://worker.example/v1/cases", {
    method: "OPTIONS",
    headers: { origin: "https://sukuma.example", "access-control-request-method": "POST" }
  }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), "https://sukuma.example");
  assert.match(response.headers.get("access-control-allow-methods"), /POST/);
});

test("requires bearer authentication for case routes before database access", async () => {
  const response = await handleRequest(new Request("https://worker.example/v1/cases"), env);
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Authentication required." });
});

test("fails closed when auth configuration is missing", async () => {
  const response = await handleRequest(new Request("https://worker.example/v1/cases", {
    headers: { authorization: "Bearer placeholder" }
  }), { ALLOWED_ORIGINS: "https://sukuma.example" });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Authentication is not configured." });
});

test("rejects unsupported methods before authentication", async () => {
  const response = await handleRequest(new Request("https://worker.example/v1/cases", { method: "DELETE" }), env);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, POST, PATCH, OPTIONS");
});

test("requires JSON content type on write requests", async () => {
  const response = await handleRequest(new Request("https://worker.example/v1/cases", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "{}"
  }), env);
  assert.equal(response.status, 415);
  assert.deepEqual(await response.json(), { error: "Content-Type must be application/json." });
});
