// Tests for the small helpers in src/site.js. Run with `npm test` in frontend/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatNumber, formatPublished, pageFor } from '../src/site.js';

test('formatPublished turns YYYY-MM into a short month and year', () => {
  assert.equal(formatPublished('2026-09'), 'Sep ’26');
  assert.equal(formatPublished('2026-01'), 'Jan ’26');
  assert.equal(formatPublished('2031-12'), 'Dec ’31');
});

test('formatNumber pads to three digits', () => {
  assert.equal(formatNumber(1), '001');
  assert.equal(formatNumber(42), '042');
  assert.equal(formatNumber(1234), '1234');
});

test('pageFor finds the section for a page and its sub-pages', () => {
  assert.equal(pageFor('/').section, 'Front page');
  assert.equal(pageFor('/essays').section, 'Essays');
  assert.equal(pageFor('/essays/').section, 'Essays');
  assert.equal(pageFor('/essays/3').section, 'Essays');
  assert.equal(pageFor('/reviews/1').section, 'Reviews');
  assert.equal(pageFor('/add').section, 'Add');
  assert.equal(pageFor('/login').section, 'Log in');
  assert.equal(pageFor('/no-such-page').section, 'Not found');
});
