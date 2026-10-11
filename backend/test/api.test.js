// API tests. They run against a throwaway `kweb_test` database (dropped and recreated on every run),
// in the same Postgres as the dev database, which they never touch.
// Needs the database running: `docker compose up -d db`, then `npm test` in backend/.
import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';

const TEST_DB = 'kweb_test';

let server;
let pool;
let base;

before(async () => {
  const admin = new pg.Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || 'kweb',
    password: process.env.POSTGRES_PASSWORD,
    database: 'postgres',
  });
  await admin.connect();
  await admin.query(`DROP DATABASE IF EXISTS ${TEST_DB} WITH (FORCE)`);
  await admin.query(`CREATE DATABASE ${TEST_DB}`);
  await admin.end();

  // The pool reads POSTGRES_DB when it is first imported, so point it at the test database before importing the app.
  process.env.POSTGRES_DB = TEST_DB;
  ({ pool } = await import('../src/db/pool.js'));
  const { migrate } = await import('../src/db/migrate.js');
  const { app } = await import('../src/app.js');
  await migrate();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}/api`;
});

after(async () => {
  await new Promise((resolve) => (server ? server.close(resolve) : resolve()));
  await pool?.end();
});

// Small fetch wrapper: sends JSON, passes the session cookie if given one, returns { status, body, cookie }.
async function api(path, { method = 'GET', body, cookie } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: { ...(body && { 'Content-Type': 'application/json' }), ...(cookie && { Cookie: cookie }) },
    body: body && JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null, cookie: res.headers.get('set-cookie')?.split(';')[0] };
}

async function loginAs(name, password) {
  const res = await api('/login', { method: 'POST', body: { name, password } });
  assert.equal(res.status, 200);
  return res.cookie;
}

const essay = (overrides = {}) => ({
  kind: 'essay',
  title: 'An essay',
  body: 'Some text.',
  subsection: 'archaeology',
  publishedOn: '2026-09',
  ...overrides,
});

const review = (overrides = {}) => ({
  kind: 'review',
  title: 'A review',
  itemTitle: 'A book',
  itemAuthor: 'An author',
  body: 'Some thoughts.',
  publishedOn: '2026-09',
  ...overrides,
});

test('health check reports the database as reachable', async () => {
  const res = await api('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.db, 'ok');
});

describe('logging in', () => {
  test('each seeded user can log in', async () => {
    for (const [name, password] of [['user', '1234'], ['admin', 'admin'], ['kirsty', 'kirsty']]) {
      const res = await api('/login', { method: 'POST', body: { name, password } });
      assert.equal(res.status, 200, name);
      assert.deepEqual(res.body, { name });
      assert.match(res.cookie, /^kweb_session=/);
    }
  });

  test('a wrong password, unknown user or blank fields are rejected', async () => {
    for (const body of [
      { name: 'admin', password: 'wrong' },
      { name: 'nobody', password: 'admin' },
      { name: '', password: '' },
    ]) {
      const res = await api('/login', { method: 'POST', body });
      assert.equal(res.status, 401, JSON.stringify(body));
      assert.equal(res.cookie, undefined);
    }
  });

  test('missing fields are a bad request', async () => {
    assert.equal((await api('/login', { method: 'POST', body: {} })).status, 400);
    assert.equal((await api('/login', { method: 'POST' })).status, 400);
  });

  test('/me knows who is logged in, and logging out ends the session', async () => {
    assert.equal((await api('/me')).status, 401);

    const cookie = await loginAs('kirsty', 'kirsty');
    assert.deepEqual((await api('/me', { cookie })).body, { name: 'kirsty' });

    assert.equal((await api('/logout', { method: 'POST', cookie })).status, 204);
    assert.equal((await api('/me', { cookie })).status, 401);
  });

  test('a made-up session cookie does not count as logged in', async () => {
    assert.equal((await api('/me', { cookie: 'kweb_session=not-a-real-token' })).status, 401);
  });
});

describe('adding content', () => {
  let cookie;
  before(async () => {
    cookie = await loginAs('admin', 'admin');
  });

  const add = (body) => api('/content', { method: 'POST', body, cookie });

  test('only works when logged in', async () => {
    const res = await api('/content', { method: 'POST', body: essay() });
    assert.equal(res.status, 401);
  });

  test('a blank essay is rejected, naming every missing field', async () => {
    const res = await add({ kind: 'essay', title: '', body: '', subsection: '', publishedOn: '' });
    assert.equal(res.status, 400);
    for (const field of ['title', 'text', 'date published', 'subsection']) assert.match(res.body.error, new RegExp(field));
  });

  test('a blank review is rejected, naming every missing field', async () => {
    const res = await add({ kind: 'review', title: '', itemTitle: '', itemAuthor: '', body: '', publishedOn: '' });
    assert.equal(res.status, 400);
    for (const field of ['title', 'text', 'date published', 'title of the item reviewed', 'author of the item reviewed']) {
      assert.match(res.body.error, new RegExp(field));
    }
  });

  test('whitespace-only fields count as blank', async () => {
    const res = await add(essay({ title: '   ', body: '\n\n' }));
    assert.equal(res.status, 400);
    assert.match(res.body.error, /title, text/);
  });

  test('bad values are rejected', async () => {
    for (const body of [
      essay({ kind: 'poem' }),
      essay({ subsection: 'geology' }),
      essay({ publishedOn: '2026-13' }),
      essay({ publishedOn: 'September' }),
      essay({ bibliography: [{ name: 'No link', url: '' }] }),
      essay({ bibliography: [{ name: '', url: 'https://example.com' }] }),
      essay({ bibliography: [{ name: 'Sneaky', url: 'javascript:alert(1)' }] }),
      essay({ bibliography: 'not a list' }),
      review({ itemUrl: 'not a link' }),
      review({ itemUrl: 'javascript:alert(1)' }),
    ]) {
      assert.equal((await add(body)).status, 400, JSON.stringify(body));
    }
  });

  test('nothing was saved by the rejected attempts', async () => {
    assert.deepEqual((await api('/essays')).body, []);
    assert.deepEqual((await api('/reviews')).body, []);
  });

  test('ids count across all content, numbers count per kind', async () => {
    const results = [];
    for (const body of [essay({ title: 'First essay' }), review({ title: 'First review' }), essay({ title: 'Second essay' })]) {
      const res = await add(body);
      assert.equal(res.status, 201);
      results.push([res.body.kind, res.body.id, res.body.number]);
    }
    assert.deepEqual(results, [
      ['essay', 1, 1],
      ['review', 2, 1],
      ['essay', 3, 2],
    ]);
  });

  test('saves the bibliography, trimming text and dropping fully blank rows', async () => {
    const res = await add(
      essay({
        title: '  Essay with sources  ',
        publishedOn: '2026-10',
        bibliography: [
          { name: ' Source one ', url: 'https://example.com/one' },
          { name: '', url: '' },
          { name: 'Source two', url: 'http://example.org/two' },
        ],
      })
    );
    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'Essay with sources');

    const saved = (await api(`/essays/${res.body.number}`)).body;
    assert.deepEqual(saved.bibliography, [
      { name: 'Source one', url: 'https://example.com/one' },
      { name: 'Source two', url: 'http://example.org/two' },
    ]);
  });

  test('a review link is optional', async () => {
    const withLink = await add(review({ title: 'Linked review', itemUrl: 'https://example.com/book' }));
    const withoutLink = await add(review({ title: 'Unlinked review', itemUrl: '' }));
    assert.equal((await api(`/reviews/${withLink.body.number}`)).body.itemUrl, 'https://example.com/book');
    assert.equal((await api(`/reviews/${withoutLink.body.number}`)).body.itemUrl, null);
  });

  test('fields that belong to the other kind are ignored', async () => {
    const res = await add(essay({ title: 'Essay with stray fields', itemTitle: 'x', itemAuthor: 'y', itemUrl: 'https://x.com' }));
    assert.equal(res.status, 201);
    const { rows } = await pool.query('SELECT item_title, item_author, item_url FROM content WHERE id = $1', [res.body.id]);
    assert.deepEqual(rows[0], { item_title: null, item_author: null, item_url: null });
  });
});

describe('reading content', () => {
  test('the essay index lists newest first, without the text', async () => {
    const essays = (await api('/essays')).body;
    assert.deepEqual(
      essays.map((e) => e.title),
      ['Essay with sources', 'Essay with stray fields', 'Second essay', 'First essay']
    );
    assert.equal(essays[0].body, undefined);
    assert.equal(essays[0].publishedOn, '2026-10');
  });

  test('a single essay has its text, subsection and date', async () => {
    const res = await api('/essays/1');
    assert.equal(res.status, 200);
    assert.equal(res.body.title, 'First essay');
    assert.equal(res.body.body, 'Some text.');
    assert.equal(res.body.subsection, 'archaeology');
    assert.equal(res.body.publishedOn, '2026-09');
  });

  test('the review index and a single review', async () => {
    const reviews = (await api('/reviews')).body;
    assert.equal(reviews.length, 3);
    assert.equal(reviews[0].body, undefined);

    const res = await api('/reviews/1');
    assert.equal(res.status, 200);
    assert.equal(res.body.title, 'First review');
    assert.equal(res.body.itemTitle, 'A book');
    assert.equal(res.body.itemAuthor, 'An author');
  });

  test('malformed JSON is a bad request, not a server error', async () => {
    const res = await fetch(`${base}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name": ' });
    assert.equal(res.status, 400);
  });

  test('missing or nonsense numbers are a 404', async () => {
    for (const path of ['/essays/99', '/essays/0', '/essays/abc', '/reviews/99', '/reviews/abc', '/nothing-here']) {
      assert.equal((await api(path)).status, 404, path);
    }
  });
});
