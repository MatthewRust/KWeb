-- pgcrypto provides crypt() / gen_salt() for bcrypt password hashing.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- People who can log in to manage the site's content.
-- Passwords are never stored as plain text, only as a bcrypt hash: crypt('password', gen_salt('bf', 10)).
-- To check a login: WHERE name = $1 AND password_hash = crypt($2, password_hash)
CREATE TABLE users (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Everything that gets posted to the site. `kind` says which section it belongs to:
--   essay   — an essay: title + body
--   reading — "what i've been reading": title (the paper or book), author, body (thoughts on it)
CREATE TABLE content (
  id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind       text NOT NULL CHECK (kind IN ('essay', 'reading')),
  title      text NOT NULL,
  body       text NOT NULL,
  author     text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
