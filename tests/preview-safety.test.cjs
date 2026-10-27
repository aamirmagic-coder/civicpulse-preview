const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const app = fs.readFileSync(path.resolve(__dirname, "../app.js"), "utf8");
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

test("SUKUMA preview JavaScript parses", () => {
  assert.doesNotThrow(() => new Function(app));
});

test("SUKUMA state does not import records from another app's localStorage key", () => {
  assert.doesNotMatch(app, /jarvis-second-brain-v1/);
  assert.match(app, /loadState\(\)\{try\{const raw=localStorage\.getItem\(KEY\)\|\|'\{\}'/);
});

test("SUKUMA preview keeps the SUKUMA! brand and warns against sensitive local data", () => {
  assert.match(html, /<title>Sukuma! — Community Accountability<\/title>/);
  assert.match(app, /Do not store sensitive data here/);
});
