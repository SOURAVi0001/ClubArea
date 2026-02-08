# ClubArea – React SPA (Client)

Modern React frontend for the ClubArea college club management platform. Built with Vite, Tailwind CSS, React Router v6, TanStack Query v5, Zustand, and Axios.

## Quick start

```bash
npm install
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` – development server with HMR
- `npm run build` – production build
- `npm run preview` – preview production build locally

## Project structure

```
src/
├── api/           # Axios instance and API services (clubs mocked until backend API)
├── assets/        # Static assets
├── components/
│   ├── common/    # Navbar, Footer, Sidebar
│   └── ui/        # Button, Card, Input
├── features/      # auth, clubs, dashboard, home, recruitment
├── hooks/         # useClubs, useClub (TanStack Query)
├── layouts/       # MainLayout, DashboardLayout, AuthLayout
├── pages/         # Route page components
├── routes/        # React Router config
├── stores/        # Zustand: useAuthStore, useUIStore
└── utils/         # Constants, helpers
```

## Backend / API

- Default base URL for API calls: `/api` (proxied in dev to your Express server; set `VITE_API_BASE` in `.env` if needed).
- Clubs API is **mocked** in `src/api/clubs.js` until the backend exposes REST endpoints. Replace `fetchClubs` / `fetchClubById` with real `api.get(...)` when ready.

## Assets

- **Logo:** `public/logo.png` (copied from `frontend/partials/logo.png`).
- **Hero video:** `public/home/INTRODUCTION.MP4` (copied from `frontend/home/INTRODUCTION.MP4`).

## Routes (mapped from EJS app)

| Path | Page |
|------|------|
| `/` | Home (Hero + typing animation) |
| `/clublist` | Club list |
| `/club/:id` | Club detail |
| `/recruitment` | Recruitment |
| `/login_type`, `/login`, `/admin_login`, `/signup` | Auth |
| `/member-dashboard` | Member dashboard |
| `/leader-dashboard` (+ nested) | Leader dashboard + sidebar |
| `/updates`, `/gallery`, `/ContactUs` | Placeholders |
