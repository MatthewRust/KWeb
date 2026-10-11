import { pool } from './db/pool.js';

const SUBSECTIONS = ['archaeology', 'fieldwork', 'art history'];

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// Only http(s) links, so a bibliography entry or review link can never become a javascript: link on the essay page.
function isWebLink(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

const ESSAY_FIELDS = `id, number, title, subsection, to_char(published_on, 'YYYY-MM') AS "publishedOn"`;

// GET /api/essays — every essay, newest first, without the text (for the index).
export async function listEssays(req, res) {
  const { rows } = await pool.query(`
    SELECT ${ESSAY_FIELDS}
    FROM content
    WHERE kind = 'essay'
    ORDER BY published_on DESC, number DESC
  `);
  res.json(rows);
}

// GET /api/essays/:number — one essay in full, looked up by its essay number.
export async function getEssay(req, res) {
  const number = Number(req.params.number);
  if (!Number.isInteger(number) || number < 1) return res.status(404).json({ error: 'Essay not found' });

  const { rows } = await pool.query(
    `SELECT ${ESSAY_FIELDS}, body, bibliography FROM content WHERE kind = 'essay' AND number = $1`,
    [number]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Essay not found' });
  res.json(rows[0]);
}

const REVIEW_FIELDS = `id, number, title, item_title AS "itemTitle", item_author AS "itemAuthor",
  to_char(published_on, 'YYYY-MM') AS "publishedOn"`;

// GET /api/reviews — every review, newest first, without the text (for the index).
export async function listReviews(req, res) {
  const { rows } = await pool.query(`
    SELECT ${REVIEW_FIELDS}
    FROM content
    WHERE kind = 'review'
    ORDER BY published_on DESC, number DESC
  `);
  res.json(rows);
}

// GET /api/reviews/:number — one review in full, looked up by its review number.
export async function getReview(req, res) {
  const number = Number(req.params.number);
  if (!Number.isInteger(number) || number < 1) return res.status(404).json({ error: 'Review not found' });

  const { rows } = await pool.query(
    `SELECT ${REVIEW_FIELDS}, item_url AS "itemUrl", body FROM content WHERE kind = 'review' AND number = $1`,
    [number]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Review not found' });
  res.json(rows[0]);
}

// POST /api/content — adds an essay or a review. Logged-in users only (see requireAuth).
// publishedOn is 'YYYY-MM' (what <input type="month"> gives).
export async function createContent(req, res) {
  const kind = req.body?.kind;
  const title = text(req.body?.title);
  const body = text(req.body?.body);
  const publishedOn = text(req.body?.publishedOn);
  const subsection = kind === 'essay' ? text(req.body?.subsection) : null;
  const itemTitle = kind === 'review' ? text(req.body?.itemTitle) : null;
  const itemAuthor = kind === 'review' ? text(req.body?.itemAuthor) : null;
  const itemUrl = kind === 'review' ? text(req.body?.itemUrl) || null : null;
  const rawBibliography = kind === 'essay' ? (req.body?.bibliography ?? []) : [];
  const bibliography = Array.isArray(rawBibliography)
    ? rawBibliography.map((item) => ({ name: text(item?.name), url: text(item?.url) })).filter((item) => item.name || item.url)
    : null;

  const missing = [];
  if (kind !== 'essay' && kind !== 'review') missing.push('type');
  if (!title) missing.push('title');
  if (!body) missing.push('text');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(publishedOn)) missing.push('date published');
  if (kind === 'essay' && !SUBSECTIONS.includes(subsection)) missing.push('subsection');
  if (kind === 'review' && !itemTitle) missing.push('title of the item reviewed');
  if (kind === 'review' && !itemAuthor) missing.push('author of the item reviewed');
  if (itemUrl && !isWebLink(itemUrl)) missing.push('link to the original (must start with http:// or https://)');
  if (!bibliography || bibliography.some((item) => !item.name || !isWebLink(item.url))) {
    missing.push('bibliography (every entry needs a name and an http:// or https:// link)');
  }
  if (missing.length) return res.status(400).json({ error: `Missing or invalid: ${missing.join(', ')}` });

  // The lock stops two submissions at the same moment from getting the same number.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE content IN SHARE ROW EXCLUSIVE MODE');
    const { rows } = await client.query(
      `INSERT INTO content (kind, number, title, body, subsection, item_title, item_author, item_url, bibliography, published_on)
       VALUES ($1, (SELECT coalesce(max(number), 0) + 1 FROM content WHERE kind = $1), $2, $3, $4, $5, $6, $7, $8, ($9 || '-01')::date)
       RETURNING id, kind, number, title, to_char(published_on, 'YYYY-MM') AS "publishedOn"`,
      [kind, title, body, subsection, itemTitle, itemAuthor, itemUrl, JSON.stringify(bibliography), publishedOn]
    );
    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
