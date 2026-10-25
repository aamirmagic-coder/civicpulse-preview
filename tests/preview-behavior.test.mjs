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
  assert.match(app, /No (matching records|records match the selected filters)\.?/);
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
    assert.match(app, /Issue location \(optional(?:; avoid home or unit numbers)?\)/);
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
  assert.match(app, /contactConsentAt=\(phone\|\|email\)&&contactConsent\?new Date\(\)\.toISOString\(\):''/);
  assert.match(app, /contactConsent\.checked=Boolean\(row\.contactConsentAt\)/);
});


test('People and Team lists filter by contact purpose and summarize consent safely', () => {
  assert.match(app, /contact-purpose-filter/);
  assert.match(app, /this\.contactPurposeFilter==='all'\|\|\(row\.contactPurpose\|\|'general'\)===this\.contactPurposeFilter/);
  assert.match(app, /Permission recorded/);
  assert.match(app, /Permission not recorded/);
  assert.match(app, /Permission date: /);
  assert.match(css, /\.module-record-controls/);
});


test('People and Team views show local role/purpose summaries and privacy-aware empty states', () => {
  assert.match(app, /people-team-summary/);
  assert.match(app, /Team coordination/);
  assert.match(app, /Service follow-up/);
  assert.match(app, /permission timestamp/);
  assert.match(app, /No people records yet/);
  assert.match(app, /No team records yet/);
  assert.match(css, /\.people-team-summary-grid/);
});

// Follow-up validation: overview styles are committed with the current branch head.


test('Tasks and Issues show accurate local operational summaries', () => {
  assert.match(app, /tasks-issues-summary/);
  assert.match(app, /\['Open tasks',openRows\.length\]/);
  assert.match(app, /\['Overdue',overdueRows\.length\]/);
  assert.match(app, /\['Completed',list\.length-openRows\.length\]/);
  assert.match(app, /\['Open issues',openRows\.length\]/);
  assert.match(app, /\['Resolved',list\.length-openRows\.length\]/);
  assert.match(app, /Categories affected/);
  assert.match(app, /No municipal case system or live public map is connected/);
});


test('Tasks can be filtered by priority and issues by category', () => {
  assert.match(app, /task-priority-filter/);
  assert.match(app, /this\.taskPriorityFilter==='all'\|\|String\(row\.priority\|\|'normal'\)\.toLowerCase\(\)===this\.taskPriorityFilter/);
  assert.match(app, /issue-category-filter/);
  assert.match(app, /this\.issueCategoryFilter==='all'\|\|\(row\.category\|\|'Other'\)===this\.issueCategoryFilter/);
  assert.match(app, /this\.taskPriorityFilter='all';this\.issueCategoryFilter='all';this\.renderGlobalSearch\(\)/);
  assert.match(app, /this\.taskPriorityFilter!=='all'\|\|this\.issueCategoryFilter!=='all'/);
});



test('issue reporting separates internal notes from public-safe summaries and evidence references', () => {
  assert.match(app, /Internal case notes \(local only; not secure\)/);
  assert.match(app, /Public-safe summary \(optional; no names or contact details\)/);
  assert.match(app, /publicInput\.maxLength=500/);
  assert.match(app, /evidenceInput\.maxLength=300/);
  assert.match(app, /Evidence note or reference \(optional\)/);
  assert.match(app, /evidence files are not uploaded or securely stored/i);
  assert.match(app, /never publish reporter names, phone numbers or internal notes/i);
  assert.match(app, /No municipal case system or live public map is connected/);
});

test('issue reporting guides users to approximate public locations and avoids storing evidence files', () => {
  assert.match(app, /street, area or landmark; avoid home\/unit numbers/i);
  assert.match(app, /avoid home or unit numbers/i);
  assert.match(app, /do not paste private links/i);
  assert.match(app, /locationInput\.maxLength=240/);
  assert.match(app, /publicSummary:publicSummary\.slice\(0,500\)/);
  assert.match(app, /evidenceNote:evidenceNote\.slice\(0,300\)/);
  assert.match(app, /publicSummaryInput\.value=String\(row\.publicSummary\|\|''\)/);
  assert.match(app, /evidenceNoteInput\.value=String\(row\.evidenceNote\|\|''\)/);
  assert.match(app, /if\(publicSummaryInput\)publicSummaryInput\.value=''/);
  assert.match(app, /if\(evidenceNoteInput\)evidenceNoteInput\.value=''/);
});

test('issue form labels internal case notes as browser-private and never public-safe', () => {
  assert.match(app, /Internal case notes \(local only; not secure\)/);
  assert.match(app, /Local preview only — not secure; never copy into a public summary or map/);
  assert.match(app, /Internal case notes; local browser storage only, not secure/);
});


test('backup restore preserves bounded custom operational fields', () => {
  assert.match(app, /for\(const \[field,value\] of Object\.entries\(row\)\)/);
  assert.match(app, /\['__proto__','prototype','constructor'\]/);
  assert.match(app, /typeof value==='string'&&value\.length<=5000/);
  assert.match(app, /return \{\.\.\.safe,id:String\(row\.id\)/);
});

test('brand assets and theme references exist in repository', () => {
  assert.match(html, /src="icon\.svg"/);
  assert.doesNotMatch(app, /icon-light\.svg/);
  assert.match(icon, /viewBox="0 0 128 128"/);
  assert.match(css, /--brand-flame:#F36B32/);
  assert.match(css, /--brand-sky:#328CC1/);
});


test('backup restore preserves bounded custom operational fields', () => {
  assert.match(app, /for\(const \[field,value\] of Object\.entries\(row\)\)/);
  assert.match(app, /\['__proto__','prototype','constructor'\]/);
  assert.match(app, /typeof value==='string'&&value\.length<=5000/);
  assert.match(app, /return \{\.\.\.safe,id:String\(row\.id\)/);
});

test('brand assets and theme references exist in repository', () => {
  assert.match(html, /src="icon\.svg"/);
  assert.match(app, /icon-light\.svg/);
  assert.match(css, /--brand-flame:#F36B32/);
  assert.match(css, /--brand-sky:#328CC1/);
});
