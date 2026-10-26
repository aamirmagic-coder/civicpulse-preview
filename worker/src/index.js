import { Pool } from "@neondatabase/serverless";
import { createRemoteJWKSet, jwtVerify } from "jose";

const STATUSES = new Set(["open", "acknowledged", "in_progress", "escalated", "resolved", "closed"]);
const PRIORITIES = new Set(["low", "normal", "high", "urgent"]);
const CATEGORIES = new Set(["Water", "Sanitation", "Roads & potholes", "Electricity", "Waste collection", "Public safety", "Public facilities", "Other"]);
const CREATE_FIELDS = new Set(["title", "details", "category", "priority"]);
const UPDATE_FIELDS = new Set(["status", "note"]);
const MAX_BODY = 8192;

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff", ...headers }
});
const error = (status, message) => json({ error: message }, status);
const uuid = value => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
function onlyKeys(value, allowed) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("JSON body must be an object.");
  const bad = Object.keys(value).find(key => !allowed.has(key));
  if (bad) throw new Error("Unsupported field: " + bad);
}
function textField(value, name, max, required = false) {
  if (value === undefined || value === null) value = "";
  if (typeof value !== "string") throw new Error(name + " must be text.");
  const result = value.trim();
  if (required && !result) throw new Error(name + " is required.");
  if (result.length > max) throw new Error(name + " must be " + max + " characters or fewer.");
  return result;
}
function createPayload(body) {
  onlyKeys(body, CREATE_FIELDS);
  const title = textField(body.title, "Title", 180, true);
  const details = textField(body.details, "Details", 2000);
  const category = body.category === undefined ? "Other" : body.category;
  const priority = body.priority === undefined ? "normal" : body.priority;
  if (!CATEGORIES.has(category)) throw new Error("Unsupported category.");
  if (!PRIORITIES.has(priority)) throw new Error("Unsupported priority.");
  return { title, details, category, priority };
}
function updatePayload(body) {
  onlyKeys(body, UPDATE_FIELDS);
  if (!STATUSES.has(body.status)) throw new Error("Unsupported status.");
  return { status: body.status, note: textField(body.note, "Note", 240) };
}
async function readJson(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY) throw Object.assign(new Error("Request body too large."), { status: 413 });
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY) throw Object.assign(new Error("Request body too large."), { status: 413 });
  try { return JSON.parse(raw); } catch { throw Object.assign(new Error("Malformed JSON."), { status: 400 }); }
}
async function authenticate(request, env) {
  const auth = request.headers.get("authorization") || "";
  const match = /^Bearer ([^\s]+)$/.exec(auth);
  if (!match) throw Object.assign(new Error("Authentication required."), { status: 401 });
  if (!env.NEON_AUTH_JWKS_URL || !env.NEON_AUTH_ISSUER || !env.NEON_AUTH_AUDIENCE) {
    throw Object.assign(new Error("Authentication is not configured."), { status: 503 });
  }
  try {
    const jwks = createRemoteJWKSet(new URL(env.NEON_AUTH_JWKS_URL));
    const { payload } = await jwtVerify(match[1], jwks, {
      issuer: env.NEON_AUTH_ISSUER,
      audience: env.NEON_AUTH_AUDIENCE,
      algorithms: ["RS256", "ES256"],
      clockTolerance: 5
    });
    if (typeof payload.sub !== "string" || !payload.sub.trim() || payload.sub.length > 200) throw new Error("Missing subject");
    return { actorId: payload.sub };
  } catch {
    throw Object.assign(new Error("Invalid or expired session."), { status: 401 });
  }
}
function allowedOrigin(request, env) {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(v => v.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : false;
}
function responseHeaders(request, env) {
  const origin = allowedOrigin(request, env);
  return origin ? { "access-control-allow-origin": origin, "vary": "Origin", "access-control-allow-headers": "Authorization, Content-Type", "access-control-allow-methods": "GET, POST, PATCH, OPTIONS" } : {};
}
function dbPool(env) {
  if (!env.NEON_DATABASE_URL) throw Object.assign(new Error("Database is not configured."), { status: 503 });
  return new Pool({ connectionString: env.NEON_DATABASE_URL, max: 3 });
}
async function withDb(env, action) {
  const pool = dbPool(env);
  try { return await action(pool); } finally { await pool.end(); }
}
async function ownedCase(pool, ownerId, caseId) {
  const result = await pool.query(
    "SELECT id, title, details, category, priority, status, created_at AS \"createdAt\", updated_at AS \"updatedAt\" FROM public.sukuma_cases WHERE id = $1 AND owner_id = $2",
    [caseId, ownerId]
  );
  return result.rows[0] || null;
}
export async function handleRequest(request, env) {
  const cors = responseHeaders(request, env);
  const origin = allowedOrigin(request, env);
  if (origin === false) return error(403, "Origin not allowed.");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const url = new URL(request.url);
  if (url.pathname === "/health" && request.method === "GET") return json({ ok: true, service: "sukuma-case-api", mode: "authenticated-preview" }, 200, cors);
  if (!url.pathname.startsWith("/v1/cases")) return error(404, "Not found.");
  if (!["GET", "POST", "PATCH"].includes(request.method)) return error(405, "Method not allowed.", { allow: "GET, POST, PATCH, OPTIONS" });
  if (request.method !== "GET" && request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return error(415, "Content-Type must be application/json.");
  let session;
  try { session = await authenticate(request, env); }
  catch (e) { return error(e.status || 401, e.status === 503 ? e.message : "Authentication required.", cors); }
  try {
    return await withDb(env, async pool => {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length === 2 && parts[1] === "cases" && request.method === "GET") {
        const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") || "25", 10) || 25));
        const cursor = url.searchParams.get("before");
        const args = [session.actorId, limit];
        let cursorSql = "";
        if (cursor) {
          if (!uuid(cursor)) return error(400, "Invalid before cursor.", cors);
          args.push(cursor); cursorSql = " AND (updated_at, id) < (COALESCE((SELECT updated_at FROM public.sukuma_cases WHERE id = $3 AND owner_id = $1), now()), $3::uuid)";
        }
        const result = await pool.query(
          "SELECT id, title, details, category, priority, status, created_at AS \"createdAt\", updated_at AS \"updatedAt\" FROM public.sukuma_cases WHERE owner_id = $1" + cursorSql + " ORDER BY updated_at DESC, id DESC LIMIT $2",
          args
        );
        return json({ cases: result.rows, nextCursor: result.rows.length === limit ? result.rows[result.rows.length - 1].id : null }, 200, cors);
      }
      if (parts.length === 2 && parts[1] === "cases" && request.method === "POST") {
        const body = createPayload(await readJson(request));
        const created = await pool.query("BEGIN");
        try {
          const row = await pool.query(
            "INSERT INTO public.sukuma_cases (owner_id, title, details, category, priority, status) VALUES ($1,$2,$3,$4,$5,'open') RETURNING id, title, details, category, priority, status, created_at AS \"createdAt\", updated_at AS \"updatedAt\"",
            [session.actorId, body.title, body.details, body.category, body.priority]
          );
          await pool.query(
            "INSERT INTO public.sukuma_case_events (case_id, owner_id, actor_id, event_type, from_status, to_status, note) VALUES ($1,$2,$2,'created',NULL,'open','Case created')",
            [row.rows[0].id, session.actorId]
          );
          await pool.query("COMMIT");
          return json({ case: row.rows[0] }, 201, cors);
        } catch (e) { await pool.query("ROLLBACK"); throw e; }
      }
      if (parts.length >= 3 && parts[1] === "cases" && uuid(parts[2])) {
        const caseId = parts[2];
        const item = await ownedCase(pool, session.actorId, caseId);
        if (!item) return error(404, "Case not found.", cors);
        if (parts.length === 3 && request.method === "GET") return json({ case: item }, 200, cors);
        if (parts.length === 4 && parts[3] === "history" && request.method === "GET") {
          const events = await pool.query(
            "SELECT id, event_type AS \"eventType\", from_status AS \"fromStatus\", to_status AS \"toStatus\", note, actor_id AS \"actorId\", created_at AS \"createdAt\" FROM public.sukuma_case_events WHERE case_id = $1 AND owner_id = $2 ORDER BY created_at ASC, id ASC",
            [caseId, session.actorId]
          );
          return json({ events: events.rows }, 200, cors);
        }
        if (parts.length === 4 && parts[3] === "status" && request.method === "PATCH") {
          const body = updatePayload(await readJson(request));
          if (item.status === body.status) return error(409, "Case already has that status.", cors);
          await pool.query("BEGIN");
          try {
            const changed = await pool.query(
              "UPDATE public.sukuma_cases SET status = $1, updated_at = now(), resolved_at = CASE WHEN $1 IN ('resolved','closed') THEN COALESCE(resolved_at, now()) ELSE NULL END WHERE id = $2 AND owner_id = $3 RETURNING id, title, details, category, priority, status, created_at AS \"createdAt\", updated_at AS \"updatedAt\"",
              [body.status, caseId, session.actorId]
            );
            if (!changed.rows[0]) { await pool.query("ROLLBACK"); return error(404, "Case not found.", cors); }
            await pool.query(
              "INSERT INTO public.sukuma_case_events (case_id, owner_id, actor_id, event_type, from_status, to_status, note) VALUES ($1,$2,$2,'status_changed',$3,$4,$5)",
              [caseId, session.actorId, item.status, body.status, body.note]
            );
            await pool.query("COMMIT");
            return json({ case: changed.rows[0] }, 200, cors);
          } catch (e) { await pool.query("ROLLBACK"); throw e; }
        }
      }
      return error(404, "Not found.", cors);
    });
  } catch (e) {
    if (e?.message?.includes("Unsupported") || e?.message?.includes("required") || e?.message?.includes("characters or fewer") || e?.message?.includes("must be text") || e?.message?.includes("Malformed JSON") || e?.message?.includes("JSON body")) return error(e.status || 400, e.message, cors);
    if (e?.status === 413) return error(413, e.message, cors);
    return error(500, "The request could not be completed.", cors);
  }
}
export default { fetch: handleRequest };
