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
  assert.match(app, /\[row\.title,row\.details,row\.category,row\.priority,row\.location,row\.status,row\.date,row\.amount/);
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


test('quick capture uses an accessible dialog with validated record type, title and details', () => {
  assert.match(html, /<dialog id="capture-dialog"/);
  assert.match(html, /id="capture-form"/);
  assert.match(html, /id="capture-type"/);
  assert.match(html, /id="capture-title"[^>]*maxlength="180"/);
  assert.match(html, /id="capture-details"[^>]*maxlength="2000"/);
  assert.match(app, /capture\(\)\{const dialog=document\.getElementById\('capture-dialog'\)/);
  assert.match(app, /Choose a valid record type/);
  assert.match(app, /Keep the title to 180 characters or fewer/);
  assert.match(app, /Keep details to 2,000 characters or fewer/);
  assert.doesNotMatch(app, /capture\(\)\{[^}]*prompt\(/);
});

test('quick capture dialog has mobile layout and focus styling', () => {
  assert.match(css, /\.capture-dialog::backdrop/);
  assert.match(css, /\.capture-form input:focus-visible/);
  assert.match(css, /@media\(max-width:560px\)\{\.capture-dialog/);
});


test('task and issue forms expose relevant fields without financial noise', () => {
  assert.match(app, /Task due date/);
  assert.match(app, /Issue report date/);
  assert.match(app, /Issue location \(optional\)/);
  assert.match(app, /Keep the issue location to 240 characters or fewer/);
  assert.match(app, /location:String\(meta\.location\|\|''\)\.trim\(\)\.slice\(0,240\)/);
  assert.match(app, /if\(amountLabel\)amountLabel\.hidden=true/);
  assert.match(app, /def\.key==='issues'&&row\.location/);
});

test('issue location remains optional and is loaded when editing a record', () => {
  assert.match(app, /locationInput\.value=String\(row\.location\|\|''\)/);
  assert.match(app, /location:location\.slice\(0,240\)/);
  assert.match(app, /if\(locationInput\)locationInput\.value=''/);
});


test('task and issue records render clear status badges and overdue cues', () => {
  assert.match(app, /record-status-badge/);
  assert.match(app, /done\?'Completed':'Open'/);
  assert.match(app, /done\?'Resolved':'Open'/);
  assert.match(app, /status-overdue/);
  assert.match(app, /Task overdue/);
});

test('status badges have theme-token styling and readable labels', () => {
  assert.match(css, /\.record-status-badge/);
  assert.match(css, /\.status-complete/);
  assert.match(css, /\.status-overdue/);
});


test('module list search includes issue location, status, date and amount fields', () => {
  assert.match(app, /\[row\.title,row\.details,row\.category,row\.priority,row\.location,row\.status,row\.date,row\.amount/);
  assert.match(app, /row\.resolved\?'resolved':''/);
  assert.match(app, /row\.completed\?'completed':''/);
});


test('task and issue lists provide status filters and record sorting', () => {
  assert.match(app, /record-status-filter/);
  assert.match(app, /Overdue tasks/);
  assert.match(app, /High \/ urgent/);
  assert.match(app, /record-sort-filter/);
  assert.match(app, /oldest.*Oldest first/s);
  assert.match(app, /priorityRank/);
});


test('module lists announce result counts and offer a clear-filter recovery action', () => {
  assert.match(app, /module-record-count/);
  assert.match(app, /aria-live','polite'/);
  assert.match(app, /Showing '\+filtered\.length\+' of '\+list\.length/);
  assert.match(app, /No records match the selected filters/);
  assert.match(app, /Clear search and filters/);
});


test('People and Team records use purpose-limited contact fields with validation', () => {
  assert.match(app, /Community service follow-up/);
  assert.match(app, /Team coordination/);
  assert.match(app, /record-role/);
  assert.match(app, /record-phone/);
  assert.match(app, /record-email/);
  assert.match(app, /Enter a valid email address or leave it blank/);
  assert.match(app, /Enter a valid phone number or leave it blank/);
  assert.match(app, /contactPurpose:\['service','coordination','general'\]/);
  assert.match(app, /if\(def\.key==='people'\|\|def\.key==='team'\)/);
  assert.match(app, /Never reuse community service follow-up contacts for political outreach/);
  assert.match(app, /record-contact-consent/);
  assert.match(app, /Confirm permission to store these contact details for the selected purpose/);
  assert.match(app, /contactConsentAt/);
});


test('People and Team require explicit permission before storing phone or email', () => {
  assert.match(app, /\(phone\|\|email\)&&!contactConsent/);
  assert.match(app, /contactConsentAt\?new Date\(\)\.toISOString\(\):''/);
  assert.match(app, /contactConsent\.checked=Boolean\(row\.contactConsentAt\)/);
});
