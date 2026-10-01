# KWeb
A website for my wonderful girlfriend to display all her magical Archeology/Art History essays

## Structure

| Folder      | Purpose                                                           |
|-------------|-------------------------------------------------------------------|
| `frontend/` | React (JSX) + Tailwind CSS, built with Vite, served by nginx in Docker |
| `backend/`  | Node.js (Express) API                                             |
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

## Run with Docker (PowerShell)

```powershell
Copy-Item .env.example .env
docker compose up --build
```

- Site: http://localhost:8080
- API health: http://localhost:3000/api/health

Stop with `Ctrl+C`, or `docker compose down`.

## Local development without Docker (PowerShell)

Backend:

```powershell
cd backend
npm install
npm run dev
```

Frontend (in a second terminal):

```powershell
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173. Vite hot-reloads changes and proxies `/api` to the backend on port 3000.
