const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('SUKUMA identity replaces the visible CivicPulse brand without rewriting legacy storage keys', () => {
  const html = read('index.html');
  const app = read('app.js');
  assert.match(html, /<title>SUKUMA!/);
  assert.match(html, /Stand Up! We build together\./);
  assert.doesNotMatch(html, /CivicPulse/);
  assert.match(app, /const KEY='civicpulse-v1'/);
});

test('design tokens define both themes and clearly label unverified brand colours', () => {
  const tokens = read('tokens/tokens.css');
  assert.match(tokens, /--brand-blue:#2563EB;.*PROVISIONAL/s);
  assert.match(tokens, /--action-orange:#EA580C;.*PROVISIONAL/s);
  assert.match(tokens, /\[data-theme=light\]/);
  assert.match(tokens, /color-scheme:dark/);
});

test('preview does not ship the previous CivicPulse icon as Sukuma branding', () => {
  const html = read('index.html');
  const manifest = JSON.parse(read('manifest.json'));
  assert.doesNotMatch(html, /app-brand-logo|href="icon\.svg"/);
  assert.equal(manifest.short_name, 'SUKUMA!');
  assert.equal(manifest.icons, undefined);
});

test('accessibility guardrails and privacy limitations are documented', () => {
  const css = read('styles.css');
  const readme = read('README.md');
  const design = read('docs/SUKUMA-DESIGN-SYSTEM.md');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.match(readme, /Do not enter sensitive resident/);
  assert.match(design, /WCAG 2\.2 AA/);
});
