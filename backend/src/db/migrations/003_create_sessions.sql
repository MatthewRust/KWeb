-- Logged-in sessions. The token is a random string kept in an httpOnly cookie in the browser.
-- A session stops working after expires_at; logging out deletes the row.
CREATE TABLE sessions (
  token      text PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
