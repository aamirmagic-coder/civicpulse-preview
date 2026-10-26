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

test('preview uses the supplied original Sukuma symbol instead of the legacy CivicPulse icon', () => {
  const html = read('index.html');
  const manifest = JSON.parse(read('manifest.json'));
  assert.match(html, /src="assets\/sukuma-symbol-original\.png"/);
  assert.doesNotMatch(html, /href="icon\.svg"/);
  assert.equal(manifest.short_name, 'SUKUMA!');
  assert.equal(manifest.icons[0].src, 'assets/sukuma-symbol-original.png');
});

test('primary action text contrast meets WCAG AA for the provisional orange token', () => {
  const tokens = read('tokens/tokens.css');
  const orange = tokens.match(/--action-orange:(#[0-9A-Fa-f]{6})/)[1];
  const darkText = tokens.match(/--text-dark:(#[0-9A-Fa-f]{6})/)[1];
  const luminance = (hex) => hex.slice(1).match(/../g).map((pair) => parseInt(pair, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  const values = [luminance(orange), luminance(darkText)].sort((a, b) => b - a);
  assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5);
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
