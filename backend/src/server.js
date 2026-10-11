import express from 'express';
import cors from 'cors';
import { pool } from './db/pool.js';
import { migrate } from './db/migrate.js';
import { loadUser, login, logout, me, requireAuth } from './auth.js';
import { createContent } from './content.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(loadUser);

// Health check — used by Docker and for quick sanity checks. Also confirms the database is reachable.
app.get('/api/health', async (req, res) => {
  const time = new Date().toISOString();
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'kweb-backend', db: 'ok', time });
  } catch {
    res.status(503).json({ status: 'error', service: 'kweb-backend', db: 'unreachable', time });
  }
});

app.get('/api/essays', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT id, number, title, subsection, body, to_char(published_on, 'YYYY-MM') AS "publishedOn",
           created_at AS "createdAt", updated_at AS "updatedAt"
    FROM content
    WHERE kind = 'essay'
    ORDER BY published_on DESC, number DESC
  `);
  res.json(rows);
});

app.get('/api/reviews', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT id, number, title, item_title AS "itemTitle", item_author AS "itemAuthor", body,
           to_char(published_on, 'YYYY-MM') AS "publishedOn", created_at AS "createdAt", updated_at AS "updatedAt"
    FROM content
    WHERE kind = 'review'
    ORDER BY published_on DESC, number DESC
  `);
  res.json(rows);
});

app.post('/api/content', requireAuth, createContent);

// Login for managing content. The login page is at /login on the frontend and isn't linked anywhere.
app.post('/api/login', login);
app.post('/api/logout', logout);
app.get('/api/me', me);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

try {
  await migrate();
} catch (err) {
  console.error('Could not set up the database:', err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`KWeb backend listening on port ${PORT}`);
});
