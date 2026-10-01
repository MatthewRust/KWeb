import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check — used by Docker and for quick sanity checks.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'kweb-backend', time: new Date().toISOString() });
});

// Placeholder: essays will eventually come from Postgres or markdown files.
app.get('/api/essays', (req, res) => {
  res.json([]);
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`KWeb backend listening on port ${PORT}`);
});
