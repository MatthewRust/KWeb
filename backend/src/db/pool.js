import pg from 'pg';

// In Docker, docker-compose sets these (host = the `db` service).
// Locally, `npm run dev` loads them from the repo-root .env and the host defaults to localhost.
export const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER || 'kweb',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || 'kweb',
});
