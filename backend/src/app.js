// The Express app and its routes. server.js starts it; the tests start their own copy.
import express from 'express';
import cors from 'cors';
import { pool } from './db/pool.js';
import { loadUser, login, logout, me, requireAuth } from './auth.js';
import { createContent, getEssay, getReview, listEssays, listReviews } from './content.js';

export const app = express();

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

app.get('/api/essays', listEssays);
app.get('/api/essays/:number', getEssay);
app.get('/api/reviews', listReviews);
app.get('/api/reviews/:number', getReview);
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
