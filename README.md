## Task Manager Web Application

This project is a full-stack Task Manager web app built with **Django + DRF + PostgreSQL** on the backend and **React + TypeScript + React Router v6 + Redux Toolkit + RTK Query + TailwindCSS** on the frontend.

The implementation focuses on clean architecture, modular components, and core feature completeness (authentication, task CRUD, dashboard stats, analytics export).

### Backend (Django)

- Tech: Django 4, Django REST Framework, `django-cors-headers`.
- Apps:
  - `accounts`: session-based auth with endpoints
    - `POST /auth/register` – register user with `email`, `password`, `confirm_password`.
    - `POST /auth/login` – login via email + password, uses Django sessions.
    - `POST /auth/logout` – destroy session.
  - `tasks`: task model + API
    - `GET /tasks/` – list tasks with server-side pagination (`page`, `limit`), search (`search`), and status filter (`status=all|pending|completed|in-progress`).
    - `POST /tasks/` – create single task.
    - `GET /tasks/<id>/`, `PUT /tasks/<id>/`, `DELETE /tasks/<id>/` – retrieve, update, delete.
    - `POST /tasks/bulk` – bulk create tasks via JSON array (`tasks`) or CSV upload (`file`).
    - `GET /tasks/stats` – dashboard stats (total, completed, pending, in_progress).
    - `GET /tasks/export` – export tasks to CSV/Excel for a date range + optional status filter.

**Database**

- `backend/backend/settings.py` is configured for **PostgreSQL**:
  - DB name: `task_manager`
  - User: `task_manager`
  - Password: `task_manager`
  - Host: `localhost`, port `5432`.
- Install PostgreSQL locally, create the database and user, and then install `psycopg2-binary` in your environment if needed.

**CORS**

- `django-cors-headers` is enabled with `CORS_ALLOW_ALL_ORIGINS = True` for simplicity in local development.

**Running backend**

```bash
cd backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Frontend (React)

- Tech: Create React App (TypeScript template), React Router v6, Redux Toolkit, RTK Query, TailwindCSS.
- Structure (key files):
  - `src/store.ts` – Redux store wiring `auth` slice and RTK Query API.
  - `src/store/api.ts` – RTK Query endpoints for auth, stats, tasks CRUD, bulk create, export.
  - `src/store/authSlice.ts` – minimal auth state (`isAuthenticated` flag).
  - `src/components/ProtectedRoute.tsx` – wraps protected pages and redirects to `/login` if unauthenticated.
  - `src/components/layout/AppLayout.tsx` – responsive sidebar layout with navigation and logout.
  - Pages:
    - `src/pages/LoginPage.tsx` – login form using `useLoginMutation`.
    - `src/pages/RegisterPage.tsx` – registration form with validation using `useRegisterMutation`.
    - `src/pages/DashboardPage.tsx` – displays task counts from `useFetchStatsQuery`.
    - `src/pages/TasksPage.tsx` – main CRUD table with server-side pagination, search (debounced), and status filters.
    - `src/pages/CreateTaskPage.tsx` – single task creation + bulk creation (dynamic table + CSV upload).
    - `src/pages/AnalyticsPage.tsx` – filters and “Download Excel” button using `useExportTasksMutation`.

**Routing**

- Defined in `src/App.tsx` using React Router v6:
  - Public: `/login`, `/register`.
  - Protected (wrapped in `ProtectedRoute`): `/` (Dashboard), `/tasks`, `/tasks/create`, `/analytics`.

**TailwindCSS**

- Configured via `tailwind.config.js`, `postcss.config.js`, and `src/index.css` (includes Tailwind directives).

**Running frontend**

```bash
cd frontend
npm install
npm start
```

The app expects the backend at `http://localhost:8000`.

### Notes / Incomplete Areas

- Auth uses **Django session auth** (no JWT) and a simple `isAuthenticated` flag in Redux; production apps would typically persist auth in storage and handle refresh.
- Editing tasks is currently limited to **delete** in the table for brevity; an edit modal/page can be added by reusing `useUpdateTaskMutation`.
- Export uses CSV with an Excel-friendly content type instead of generating true `.xlsx` files, which keeps dependencies light.

### Zipping for Submission

To submit, zip the entire project directory:

```bash
cd ..
zip -r task-manager.zip "Task Manager"
```

