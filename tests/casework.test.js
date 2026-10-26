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
