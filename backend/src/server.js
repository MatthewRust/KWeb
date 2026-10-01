import express from 'express';
import cors from 'cors';
import { pool } from './db/pool.js';
import { migrate } from './db/migrate.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
    SELECT id, title, body, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM content
    WHERE kind = 'essay'
    ORDER BY created_at DESC
  `);
  res.json(rows);
});

app.get('/api/reading', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT id, title, author, body, created_at AS "createdAt", updated_at AS "updatedAt"
    FROM content
    WHERE kind = 'reading'
    ORDER BY created_at DESC
  `);
  res.json(rows);
});

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
