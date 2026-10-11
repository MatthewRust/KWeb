-- Test logins — admin / admin and kirsty / kirsty.
-- Change these passwords before the site goes public (see TODO.md).
INSERT INTO users (name, password_hash)
VALUES
  ('admin', crypt('admin', gen_salt('bf', 10))),
  ('kirsty', crypt('kirsty', gen_salt('bf', 10)))
ON CONFLICT (name) DO NOTHING;
