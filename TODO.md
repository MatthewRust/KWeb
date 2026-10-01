# Future issues

Work that has been planned but not started yet.

## Hidden login page

- A login page at a route that is not linked from the nav, so only people who know the URL find it.
- Backend: `POST /api/login` that checks the name and password against the `users` table
  (`WHERE name = $1 AND password_hash = crypt($2, password_hash)`) and starts a session.
- Protect every route that creates, edits or deletes content so it only works when logged in.

## Change the default login

- The database is seeded with `user` / `1234` (`backend/src/db/migrations/002_seed_default_user.sql`).
  Change the password, or replace the user, before the site goes public.

## Forms for posting content (behind the login)

- A form to create and edit **essays**: title, text.
- A form to create and edit **what I've been reading** entries: title, author, thoughts.
- Backend routes to create, update and delete rows in the `content` table.

## Show database content on the site

- Replace the sample text in `frontend/src/data/sample.js` with data from `GET /api/essays` and `GET /api/reading`.
