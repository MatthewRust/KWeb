# KWeb
A website for my wonderful girlfriend to display all her magical Archeology/Art History essays

## Structure

| Folder      | Purpose                                                           |
|-------------|-------------------------------------------------------------------|
| `frontend/` | React (JSX) + Tailwind CSS, built with Vite, served by nginx in Docker |
| `backend/`  | Node.js (Express) API, backed by PostgreSQL                       |
| `context/`  | Local-only notes, images and `AGENTS.md` for AI agents (git-ignored) |

Frontend code lives in `frontend/src/`:

```
src/
├─ main.jsx        # Entry point
├─ App.jsx         # Routes
├─ pages/          # One JSX file per page (Home, Essays, Essay, Reviews, Review, Gallery, About, Login, Add)
├─ components/     # Shared JSX (Layout, Nav, Footer)
└─ css/            # Stylesheets (Tailwind entry)
```

Backend code lives in `backend/src/`:

```
src/
├─ server.js       # Starts the app: runs migrations, then listens
├─ app.js          # Express app and API routes
├─ auth.js         # Login sessions
├─ content.js      # Essays and reviews: reading and adding
├─ images.js       # Gallery images: listing and uploading
├─ cloudinary.js   # Uploads to Cloudinary, which stores the image files
└─ db/
   ├─ pool.js      # Postgres connection
   ├─ migrate.js   # Applies new migrations on startup
   └─ migrations/  # Numbered .sql files: tables and the default user
```

## Database

PostgreSQL runs as the `db` service in Docker. When the backend starts it applies any new files in
`backend/src/db/migrations/`, in order, and records them in a `schema_migrations` table so each runs once.
These migrations are development scaffolding; they will be collapsed into one file per table before the site is finished.

| Table      | Columns |
|------------|---------|
| `users`    | `id`, `name` (unique), `password_hash` (bcrypt), `created_at` |
| `sessions` | `token`, `user_id`, `created_at`, `expires_at` |
| `images`   | `id`, `public_id`, `url` (on Cloudinary), `width`, `height`, `description` (≤ 50 chars), `created_at` |
| `content`  | `id`, `kind` (`essay` or `review`), `number` (per kind), `title`, `body`, `subsection` (essays), `bibliography` (essays), `item_title`, `item_author`, `item_url` (reviews), `published_on`, `created_at`, `updated_at` |

Test logins: `user` / `1234`, `admin` / `admin`, `kirsty` / `kirsty`. Change them before the site goes public.
The login page is at `/login` and isn't linked from the site.

API:

- `GET /api/essays`, `GET /api/essays/:number`: essays, newest first / one essay
- `GET /api/reviews`, `GET /api/reviews/:number`: reviews, newest first / one review
- `POST /api/content`: add an essay or review (logged in only)
- `GET /api/images`: gallery images, newest first, with polaroid-size and full-size URLs
- `POST /api/images`: upload an image with an optional description (logged in only; multipart form, up to 10 MB)
- `POST /api/login`, `POST /api/logout`, `GET /api/me`

### Images (Cloudinary)

Gallery images are stored on [Cloudinary](https://cloudinary.com); the database only records where each one is.
Copy the **API environment variable** (`cloudinary://<key>:<secret>@<cloud name>`) from the Cloudinary dashboard
into `CLOUDINARY_URL` in `.env`, then restart the backend. Without it the site works, but uploads are refused.

Planned work is listed in [TODO.md](TODO.md).

## Run with Docker (PowerShell)

```powershell
Copy-Item .env.example .env
docker compose up --build
```

- Site: http://localhost:8080
- API health: http://localhost:3000/api/health
- Database: `localhost:5432` (user, password and database name from `.env`)

Stop with `Ctrl+C`, or `docker compose down`. The data is kept in the `pgdata` volume;
`docker compose down -v` deletes it (the tables and default user are recreated on the next start).

## Local development without Docker (PowerShell)

Database (needs `.env`, see above; runs Postgres alone in Docker):

```powershell
docker compose up -d db
```

Backend (in a second terminal; reads the database settings from the repo-root `.env`):

```powershell
cd backend
npm install
npm run dev
```

Frontend (in a third terminal):

```powershell
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173. Vite hot-reloads changes and proxies `/api` to the backend on port 3000.

## Tests (PowerShell)

Backend API tests: logging in, adding essays and reviews (including blank and invalid input), numbering, reading them back,
and gallery uploads. The one test that uploads to Cloudinary for real only runs when `CLOUDINARY_URL` is set.
They need the database running and use their own `kweb_test` database, recreated on each run, so dev data is untouched.

```powershell
docker compose up -d db
cd backend
npm test
```

Frontend tests (the date, number and page helpers; no database needed):

```powershell
cd frontend
npm test
```
