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
├─ pages/          # One JSX file per page (Home, Essays, Gallery, About)
├─ components/     # Shared JSX (Layout, Nav, Footer)
└─ css/            # Stylesheets (Tailwind entry)
```

Backend code lives in `backend/src/`:

```
src/
├─ server.js       # Express app and API routes
└─ db/
   ├─ pool.js      # Postgres connection
   ├─ migrate.js   # Applies new migrations on startup
   └─ migrations/  # Numbered .sql files: tables and the default user
```

## Database

PostgreSQL runs as the `db` service in Docker. When the backend starts it applies any new files in
`backend/src/db/migrations/`, in order, and records them in a `schema_migrations` table so each runs once.
To change the schema, add a new numbered file; never edit one that has already run.

| Table     | Columns |
|-----------|---------|
| `users`   | `id`, `name` (unique), `password_hash` (bcrypt), `created_at` |
| `content` | `id`, `kind` (`essay` or `reading`), `title`, `body`, `author` (optional), `created_at`, `updated_at` |

A default user is created: name `user`, password `1234`. Change it before the site goes public.

API:

- `GET /api/essays`: all essays, newest first
- `GET /api/reading`: all reading entries, newest first

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
