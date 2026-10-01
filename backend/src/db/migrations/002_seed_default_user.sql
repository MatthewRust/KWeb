-- Default login — name: user, password: 1234.
-- Change this password before the site goes public (see TODO.md).
INSERT INTO users (name, password_hash)
VALUES ('user', crypt('1234', gen_salt('bf', 10)))
ON CONFLICT (name) DO NOTHING;
