import { pool } from './db/pool.js';

const SUBSECTIONS = ['archaeology', 'fieldwork', 'art history'];

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
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

  const missing = [];
  if (kind !== 'essay' && kind !== 'review') missing.push('type');
  if (!title) missing.push('title');
  if (!body) missing.push('text');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(publishedOn)) missing.push('date published');
  if (kind === 'essay' && !SUBSECTIONS.includes(subsection)) missing.push('subsection');
  if (kind === 'review' && !itemTitle) missing.push('title of the item reviewed');
  if (kind === 'review' && !itemAuthor) missing.push('author of the item reviewed');
  if (missing.length) return res.status(400).json({ error: `Missing or invalid: ${missing.join(', ')}` });

  // The lock stops two submissions at the same moment from getting the same number.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE content IN SHARE ROW EXCLUSIVE MODE');
    const { rows } = await client.query(
      `INSERT INTO content (kind, number, title, body, subsection, item_title, item_author, published_on)
       VALUES ($1, (SELECT coalesce(max(number), 0) + 1 FROM content WHERE kind = $1), $2, $3, $4, $5, $6, ($7 || '-01')::date)
       RETURNING id, kind, number, title, to_char(published_on, 'YYYY-MM') AS "publishedOn"`,
      [kind, title, body, subsection, itemTitle, itemAuthor, publishedOn]
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
