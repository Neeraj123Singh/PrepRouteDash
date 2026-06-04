# Preproute Test Management Application

A 5-page React application for creating, managing, and publishing MCQ tests. Built as part of the Preproute Frontend Developer evaluation task.

## Live Demo (AWS)

**https://d33bxno0xyvaq6.cloudfront.net**

Login: `vedant-admin` / `vedant123`

Deployed with **S3 + CloudFront** (Terraform). `/api` is proxied to the staging Railway backend on the same origin (no browser CORS).

### Deploy to AWS (one command)

**Prerequisites:** [AWS CLI](https://aws.amazon.com/cli/) configured (`aws configure`), [Terraform](https://www.terraform.io/downloads) >= 1.5, Node.js 22+.

```bash
chmod +x scripts/deploy-aws.sh scripts/print-submission.sh
./scripts/deploy-aws.sh
```

The script will:

1. Run `npm ci` and `npm run build` with `VITE_API_BASE_URL=/api`
2. Run `terraform init` and `terraform apply` (S3 upload + CloudFront)
3. Print the live **CloudFront URL**
4. Invalidate the CloudFront cache so updates are visible quickly

**Options:**

```bash
./scripts/deploy-aws.sh --skip-build      # reuse existing dist/ (faster redeploy)
./scripts/deploy-aws.sh --no-invalidate   # skip cache invalidation
./scripts/deploy-aws.sh --help
```

**Manual deploy** (same result):

```bash
VITE_API_BASE_URL=/api npm run build
cd terraform
cp terraform.tfvars.example terraform.tfvars   # first time only
terraform init && terraform apply
terraform output cloudfront_url
```

See [`terraform/README.md`](terraform/README.md) for infrastructure details.

### Submission (video + form text)

| Resource | Path |
|----------|------|
| Google Form copy-paste answers | [`docs/SUBMISSION_FORM.md`](docs/SUBMISSION_FORM.md) |
| Video recording script (~8–12 min) | [`docs/VIDEO_WALKTHROUGH_SCRIPT.md`](docs/VIDEO_WALKTHROUGH_SCRIPT.md) |
| Print deploy URL + technical decisions | `./scripts/print-submission.sh` |

[Preproute evaluation form](https://forms.gle/WmZbBQZiLfo8WNn79)

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

## Submission checklist

See [`SUBMISSION_CHECKLIST.md`](SUBMISSION_CHECKLIST.md) for evaluation criteria mapping and pre-submit tasks.

## Scripts

| Command | Description |
|---------|-------------|
| `./scripts/deploy-aws.sh` | Build + deploy to AWS (S3 + CloudFront) |
| `./scripts/print-submission.sh` | Print form text (URL, technical decisions) |
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
- [x] Deployed web application — https://d33bxno0xyvaq6.cloudfront.net
- [ ] Task walkthrough video — record with [`docs/VIDEO_WALKTHROUGH_SCRIPT.md`](docs/VIDEO_WALKTHROUGH_SCRIPT.md), submit link via [`docs/SUBMISSION_FORM.md`](docs/SUBMISSION_FORM.md)
- [x] Technical decisions — README + `./scripts/print-submission.sh`

## Author Notes

If login fails with "Invalid credentials", confirm credentials with Preproute or verify the staging API is active. The app sends `userId` and `password` as documented.
# PrepRouteDash
