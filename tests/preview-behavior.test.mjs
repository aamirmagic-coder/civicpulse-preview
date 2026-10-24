import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('app.js', 'utf8');
const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');

test('record form exposes edit, save and cancel controls', () => {
  for (const id of ['record-form','record-title','record-details','record-date','record-amount','record-submit-btn','record-cancel-edit']) {
    assert.match(html, new RegExp('id="' + id + '"'), 'missing form control: ' + id);
  }
  assert.match(app, /startEditRecord\(listKey,row\)/);
  assert.match(app, /resetRecordForm\(\)/);
  assert.match(app, /this\.log\('Updated '\+def\.key\+' record'\)/);
});

test('task and issue workflows include typed fields and status controls', () => {
  assert.match(app, /record-priority/);
  assert.match(app, /record-category/);
  assert.match(app, /Issue marked resolved/);
  assert.match(app, /Issue reopened/);
  assert.match(app, /Task status updated/);
});

test('dashboard progress and activity widgets have matching render hooks', () => {
  for (const id of ['task-progress-bar','task-progress-fill','task-progress-copy','dashboard-activity']) {
    assert.match(html, new RegExp('id="' + id + '"'), 'missing dashboard widget: ' + id);
    assert.ok(app.includes(id), 'missing JavaScript hook: ' + id);
  }
});

test('backup import is bounded and asks before replacing local data', () => {
  assert.match(app, /file\.size>5\*1024\*1024/);
  assert.match(app, /total>10000/);
  assert.match(app, /Replace this browser’s local workspace/);
});

test('global search covers status/date/amount and supports Escape dismissal', () => {
  assert.match(app, /String\(row\.status\|\|''\)/);
  assert.match(app, /String\(row\.date\|\|''\)/);
  assert.match(app, /typeof row\.amount==='number'\?String\(row\.amount\)/);
  assert.match(app, /e\.key==='Escape'/);
  assert.match(app, /panel\.hidden=true/);
});

test('backup export allows the browser time to start downloading', () => {
  assert.match(app, /setTimeout\(\(\)=>URL\.revokeObjectURL\(url\),1000\)/);
});

test('record creation and deletion validate and protect local data', () => {
  assert.match(app, /That record type is not available/);
  assert.match(app, /Enter a title before saving/);
  assert.match(app, /slice\(0,180\)/);
  assert.match(app, /This cannot be undone unless you have a backup/);
  assert.match(app, /if\(!this\.saveState\(\)\)\{this\.state\[listKey\]=previous;return;\}/);
});

test('editing controls have mobile responsive styling', () => {
  assert.match(css, /record-form-actions/);
  assert.match(css, /@media\(max-width:560px\)/);
});

test('edit workflow validates actual calendar dates and cancels on module change', () => {
  assert.match(app, /Choose a real calendar date/);
  assert.match(app, /if\(this\.editingRecordId&&view!==this\.currentView\)this\.resetRecordForm\(\)/);
  assert.match(app, /if\(!this\.saveState\(\)\)\{Object\.assign\(row,before\);return;\}/);
});

test('task and issue status changes roll back if local save fails', () => {
  assert.match(app, /if\(!this\.saveState\(\)\)\{Object\.assign\(row,before\);return;\}/);
  assert.match(app, /Status changes are available for tasks and issues only/);
  assert.match(app, /row\.status=row\.completed\?'completed':'active'/);
  assert.match(app, /row\.status=row\.resolved\?'resolved':'active'/);
});

test('global search filters module records and has a clear empty state', () => {
  assert.match(app, /this\.searchTerm=e\.target\.value\.trim\(\)\.toLowerCase\(\)/);
  assert.match(app, /No matching records\./);
  assert.match(app, /String\(row\.category\|\|''\).*String\(row\.priority\|\|''\)/);
});


test('backup recovery tolerates omitted legacy sections but rejects malformed sections', () => {
  assert.match(app, /data\[key\]===undefined\?\[\]:data\[key\]/);
  assert.match(app, /Invalid backup section: '\+key/);
  assert.match(app, /Backup contains too many records/);
});

test('backup restore validates calendar dates and normalizes task/issue statuses', () => {
  assert.match(app, /const validDate=\/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$\//);
  assert.match(app, /const completed=key==='tasks'\?/);
  assert.match(app, /const resolved=key==='issues'\?/);
  assert.match(app, /if\(key==='tasks'\)status=completed\?'completed':'active'/);
  assert.match(app, /if\(key==='issues'\)status=resolved\?'resolved':'active'/);
});
