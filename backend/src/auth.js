import { randomBytes } from 'node:crypto';
import { pool } from './db/pool.js';

const COOKIE_NAME = 'kweb_session';
const SESSION_DAYS = 7;

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  path: '/',
};

function sessionToken(req) {
  const cookies = req.headers.cookie?.split(';') ?? [];
  for (const cookie of cookies) {
    const [name, ...value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) return decodeURIComponent(value.join('='));
  }
  return null;
}

// Looks up the logged-in user from the session cookie. Sets req.user (or leaves it undefined).
export async function loadUser(req, res, next) {
  const token = sessionToken(req);
  if (token) {
    const { rows } = await pool.query(
      `SELECT users.id, users.name
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = $1 AND sessions.expires_at > now()`,
      [token]
    );
    req.user = rows[0];
  }
  next();
}

// Put in front of any route that creates, edits or deletes content.
export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  next();
}

export async function login(req, res) {
  const { name, password } = req.body ?? {};
  if (typeof name !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Name and password are required' });
  }

  const { rows } = await pool.query(
    'SELECT id, name FROM users WHERE name = $1 AND password_hash = crypt($2, password_hash)',
    [name, password]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Wrong name or password' });

  const token = randomBytes(32).toString('hex');
  await pool.query(
    `INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3))`,
    [token, user.id, SESSION_DAYS]
  );
  // Tidy up old sessions while we're here.
  await pool.query('DELETE FROM sessions WHERE expires_at <= now()');

  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000 });
  res.json({ name: user.name });
}

export async function logout(req, res) {
  const token = sessionToken(req);
  if (token) await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
}

export function me(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  res.json({ name: req.user.name });
}
