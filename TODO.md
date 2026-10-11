# Future issues

Work that has been planned but not started yet.

## Session cookie over HTTPS

- The session cookie is not marked `secure`, because the site is served over plain HTTP for now.
  Once it is behind HTTPS, add `secure: true` to `cookieOptions` in `backend/src/auth.js`.

## Change the default login

- The database is seeded with `user` / `1234` (`backend/src/db/migrations/002_seed_default_user.sql`).
  Change the password, or replace the user, before the site goes public.

## Forms for posting content (behind the login)

- Build them on the `/add` page (`frontend/src/pages/Add.jsx`, currently blank).
- Put `requireAuth` (`backend/src/auth.js`) in front of every route that creates, edits or deletes content.
- A form to create and edit **essays**: title, text.
- A form to create and edit **what I've been reading** entries: title, author, thoughts.
- Backend routes to create, update and delete rows in the `content` table.

## Show database content on the site

- Replace the sample text in `frontend/src/data/sample.js` with data from `GET /api/essays` and `GET /api/reading`.
