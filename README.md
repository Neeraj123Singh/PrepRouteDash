# Preproute Test Management Application

A 5-page React application for creating, managing, and publishing MCQ tests. Built as part of the Preproute Frontend Developer evaluation task.

## Live Demo

Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) with a same-origin `/api` rewrite/proxy to staging, or ensure the API allows your origin via CORS.

```bash
npm run build
# Deploy the `dist` folder
```

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Test credentials:** `vedant-admin` / `vedant123`

**Staging API notes:** `subject` must be a subject UUID string. Test `type` values are `chapterwise` (Chapter Wise), `pyq` (PYQ), and `mock` (Mock Test). Each bulk question must include `subject` (UUID or name).

## Application Flow

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | JWT auth, stored in localStorage |
| Dashboard | `/dashboard` | Test list with search, edit/view/delete |
| Create/Edit Test | `/tests/new`, `/tests/:id/edit` | Test metadata, cascading topic selects |
| Add Questions | `/tests/:id/questions` | MCQ builder, bulk save to API |
| Preview & Publish | `/tests/:id/preview` | Review and set status to `live` |

## Tech Stack

- **React 19 + TypeScript** — UI and type safety
- **Vite** — Build tooling
- **React Router v7** — Client-side routing with protected routes
- **TanStack Query** — Server state, caching, mutations
- **Zustand** — Auth persistence and in-session question drafts
- **Axios** — HTTP client with JWT interceptors
- **React Hook Form + Zod** — Form validation

## Technical Decisions

1. **TanStack Query + Zustand** — Query handles API data (tests, subjects, topics); Zustand persists auth token and local question drafts before bulk upload.

2. **Cascading selects** — Topics load when subject changes; sub-topics use `POST /sub-topics/multi-topics` when multiple topics are selected (per API doc).

3. **Question workflow** — Questions are held locally until "Save & Continue", then sent via `POST /questions/bulk` and linked to the test with `PUT /tests/:id`.

4. **CSS Modules + design tokens** — Figma-aligned spacing (`--space-*`), colors, and an SVG Preproute logo with dotted arc; responsive sidebar and split login layout.

5. **Error handling** — Centralized `getErrorMessage` helper; 401 responses clear auth and redirect to login.

## API Base URL

Staging API: `https://admin-moderator-backend-staging.up.railway.app/api`

Browsers block cross-origin calls to that host (CORS). Postman works because it is not a browser. This app defaults to **`/api`**, which is proxied to staging:

- **Dev** (`npm run dev`) — Vite proxy in `vite.config.ts`
- **Docker** (`docker compose up`) — nginx proxy in `nginx.conf`

Set `VITE_API_BASE_URL=/api` in `.env` (see `.env.example`). Rebuild Docker after changing it: `docker compose up --build`.

For static hosting (S3/CloudFront only), you need either API CORS for your domain or a reverse proxy on the same origin.

## Testing

```bash
npm run test        # watch mode
npm run test:run    # single run (CI)
npm run test:coverage
```

Unit tests cover API modules, Zustand stores, error utilities, `ProtectedRoute`, and `LoginPage`.

## Docker

```bash
# Production (nginx on port 8080)
docker compose up --build

# Unit tests in container
docker compose --profile test run test
```

## Terraform (AWS S3 + CloudFront)

See [`terraform/README.md`](terraform/README.md).

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform apply
terraform output cloudfront_url
```

## Submission checklist

See [`SUBMISSION_CHECKLIST.md`](SUBMISSION_CHECKLIST.md) for evaluation criteria mapping and pre-submit tasks.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test:run` | Run unit tests |

## Project Structure

```
src/
├── api/          # Axios client and API modules
├── components/   # Layout, UI primitives, ProtectedRoute
├── pages/        # Login, Dashboard, TestForm, Questions, Preview
├── store/        # Auth and test draft stores
└── types/        # Shared TypeScript interfaces
```

## Deliverables Checklist

- [x] GitHub repository (this project)
- [ ] Deployed web application (Vercel/Netlify — see above)
- [ ] Task walkthrough video
- [x] Technical decisions (this README)

## Author Notes

If login fails with "Invalid credentials", confirm credentials with Preproute or verify the staging API is active. The app sends `userId` and `password` as documented.
# PrepRouteDash
