// The Express app and its routes. server.js starts it; the tests start their own copy.
import express from 'express';
import cors from 'cors';
import { pool } from './db/pool.js';
import { loadUser, login, logout, me, requireAuth } from './auth.js';
import { createContent, getEssay, getReview, listEssays, listReviews } from './content.js';
import { MAX_FILE_MB, createImage, listImages, receiveImage } from './images.js';

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
app.get('/api/images', listImages);
// requireAuth comes first so a file from someone not logged in is never read.
app.post('/api/images', requireAuth, receiveImage, createImage);

// Login for managing content. The login page is at /login on the frontend and isn't linked anywhere.
app.post('/api/login', login);
app.post('/api/logout', logout);
app.get('/api/me', me);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: `The image can be at most ${MAX_FILE_MB} MB` });
  if (err.name === 'MulterError') return res.status(400).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
