const test = require('node:test');
const assert = require('node:assert/strict');
const { ISSUE_STATUSES, ISSUE_PRIORITIES, createIssueRecord, transitionIssue } = require('../casework.js');

test('new issue records start open with normal priority and an initial history event', () => {
  const issue = createIssueRecord({ id: 'case-1', title: 'Broken streetlight', details: 'Near the library', date: '2026-10-26' }, '2026-10-26T08:00:00.000Z');
  assert.equal(issue.status, 'open');
  assert.equal(issue.priority, 'normal');
  assert.equal(issue.completed, false);
  assert.deepEqual(issue.history, [{ status: 'open', at: '2026-10-26T08:00:00.000Z', note: 'Case created locally' }]);
});

test('issue transitions append history and update completion only for resolved or closed cases', () => {
  const issue = createIssueRecord({ id: 'case-2', title: 'Water outage' }, '2026-10-26T08:00:00.000Z');
  const active = transitionIssue(issue, 'in_progress', 'Team assigned', '2026-10-26T09:00:00.000Z');
  assert.equal(active.status, 'in_progress');
  assert.equal(active.completed, false);
  assert.equal(active.history.length, 2);
  assert.equal(active.history[1].note, 'Team assigned');
  const resolved = transitionIssue(active, 'resolved', 'Service restored', '2026-10-26T10:00:00.000Z');
  assert.equal(resolved.completed, true);
  assert.equal(resolved.history.length, 3);
});

test('invalid statuses and transitions to the same status are rejected', () => {
  const issue = createIssueRecord({ id: 'case-3', title: 'Pothole' }, '2026-10-26T08:00:00.000Z');
  assert.throws(() => transitionIssue(issue, 'political_targeting', '', '2026-10-26T09:00:00.000Z'), /Unsupported issue status/);
  assert.throws(() => transitionIssue(issue, 'open', '', '2026-10-26T09:00:00.000Z'), /already open/);
});

test('only supported priorities are accepted; private reporter fields are not copied into new case records', () => {
  assert.deepEqual(ISSUE_PRIORITIES, ['low', 'normal', 'high', 'urgent']);
  assert.throws(() => createIssueRecord({ id: 'case-4', title: 'Blocked drain', priority: 'political' }), /Unsupported issue priority/);
  const issue = createIssueRecord({ id: 'case-5', title: 'Blocked drain', reporterPhone: 'secret', politicalPreference: 'secret' }, '2026-10-26T08:00:00.000Z');
  assert.equal(Object.hasOwn(issue, 'reporterPhone'), false);
  assert.equal(Object.hasOwn(issue, 'politicalPreference'), false);
});

test('issue backup sanitization preserves valid category, priority and status history', () => {
  const { sanitizeImportedIssueRecord } = require('../casework.js');
  const source = {
    id: 'case-restore', title: 'Blocked drain', details: 'Near the park',
    category: 'Sanitation', priority: 'high', status: 'in_progress', completed: false,
    history: [
      { status: 'open', at: '2026-10-26T08:00:00.000Z', note: 'Case created locally' },
      { status: 'in_progress', at: '2026-10-26T09:00:00.000Z', note: 'Team notified' }
    ],
    reporterPhone: 'must-not-copy', politicalPreference: 'must-not-copy'
  };
  const restored = sanitizeImportedIssueRecord(source);
  assert.equal(restored.category, 'Sanitation');
  assert.equal(restored.priority, 'high');
  assert.equal(restored.status, 'in_progress');
  assert.equal(restored.history.length, 2);
  assert.equal(restored.history[1].note, 'Team notified');
  assert.equal(Object.hasOwn(restored, 'reporterPhone'), false);
  assert.equal(Object.hasOwn(restored, 'politicalPreference'), false);
});

test('issue backup sanitization safely normalizes legacy or malformed workflow fields', () => {
  const { sanitizeImportedIssueRecord } = require('../casework.js');
  const restored = sanitizeImportedIssueRecord({
    id: 'legacy-case', title: 'Old pothole record', status: 'unknown',
    category: 'political targeting', priority: 'campaign', history: [
      { status: 'made-up', at: {}, note: { secret: true } },
      { status: 'resolved', at: '2026-10-26T10:00:00.000Z', note: 'Fixed' }
    ]
  });
  assert.equal(restored.category, 'Other');
  assert.equal(restored.priority, 'normal');
  assert.equal(restored.status, 'open');
  assert.deepEqual(restored.history, [
    { status: 'resolved', at: '2026-10-26T10:00:00.000Z', note: 'Fixed' }
  ]);
});

test('issue backup history is bounded and malformed values are not copied', () => {
  const { sanitizeImportedIssueRecord } = require('../casework.js');
  const history = Array.from({ length: 520 }, (_, i) => ({
    status: 'open', at: '2026-10-26T08:00:00.000Z', note: String(i)
  }));
  const restored = sanitizeImportedIssueRecord({ id: 'long-case', title: 'Many updates', history });
  assert.equal(restored.history.length, 500);
  assert.equal(restored.history[0].note, '20');
});
