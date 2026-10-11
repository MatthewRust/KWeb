# Future issues

Work that has been planned but not started yet.

## Session cookie over HTTPS

- The session cookie is not marked `secure`, because the site is served over plain HTTP for now.
  Once it is behind HTTPS, add `secure: true` to `cookieOptions` in `backend/src/auth.js`.

## Change the default login

- The database is seeded with test logins: `user` / `1234` (`002_seed_default_user.sql`), and `admin` / `admin` and
  `kirsty` / `kirsty` (`004_seed_test_users.sql`), all in `backend/src/db/migrations/`.
  Change the passwords, or remove the test users, before the site goes public.

## Editing and deleting content

- The `/add` form can create essays and reviews (`POST /api/content`). There is no way yet to edit or delete them.
- Put `requireAuth` (`backend/src/auth.js`) in front of those routes too.

## Consolidate the database definition (before finishing)

- `backend/src/db/migrations/` currently holds the development history (001-005). Replace it with one SQL file per table
  (`users`, `sessions`, `content`) plus seed data, describing the final schema directly, with no step-by-step changes.
- Adjust `backend/src/db/migrate.js` to match, and reset the dev database once (`docker compose down -v`).
