import multer from 'multer';
import { pool } from './db/pool.js';
import { isConfigured, transformedUrl, uploadImage } from './cloudinary.js';

const MAX_DESCRIPTION = 50;
export const MAX_FILE_MB = 10; // Cloudinary's free-plan limit per image; nginx allows the same (nginx.conf).

// Square crop for the polaroid, and a large copy for the lightbox. f_auto/q_auto let Cloudinary pick the format and quality.
const THUMB = 'c_fill,g_auto,w_600,h_600,f_auto,q_auto';
const FULL = 'c_limit,w_2000,h_2000,f_auto,q_auto';

// Keeps the uploaded file in memory (req.file.buffer) just long enough to pass it on to Cloudinary.
export const receiveImage = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_MB * 1024 * 1024 } }).single('image');

function toJson(row) {
  return {
    id: row.id,
    description: row.description,
    width: row.width,
    height: row.height,
    thumbUrl: transformedUrl(row.url, THUMB),
    fullUrl: transformedUrl(row.url, FULL),
  };
}

// GET /api/images — every gallery image, newest first.
export async function listImages(req, res) {
  const { rows } = await pool.query('SELECT id, url, width, height, description FROM images ORDER BY created_at DESC, id DESC');
  res.json(rows.map(toJson));
}

// POST /api/images — multipart form with `image` (the file) and an optional `description`. Logged-in users only.
export async function createImage(req, res) {
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() || null : null;

  if (!req.file) return res.status(400).json({ error: 'Choose an image to upload' });
  if (!req.file.mimetype.startsWith('image/')) return res.status(400).json({ error: 'That file is not an image' });
  if (description && description.length > MAX_DESCRIPTION) {
    return res.status(400).json({ error: `The description can be at most ${MAX_DESCRIPTION} characters` });
  }
  if (!isConfigured()) return res.status(503).json({ error: 'Image uploads are not set up yet (CLOUDINARY_URL is missing)' });

  const uploaded = await uploadImage(req.file.buffer, req.file.mimetype);
  const { rows } = await pool.query(
    `INSERT INTO images (public_id, url, width, height, description) VALUES ($1, $2, $3, $4, $5)
     RETURNING id, url, width, height, description`,
    [uploaded.publicId, uploaded.url, uploaded.width, uploaded.height, description]
  );
  res.status(201).json(toJson(rows[0]));
}
