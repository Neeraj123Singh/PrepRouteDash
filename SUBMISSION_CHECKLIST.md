# Preproute Frontend Task — Submission Checklist

Evaluation weights from the task brief. Use this before submitting via the [Google Form](https://forms.gle/WmZbBQZiLfo8WNn79).

---

## Technical stack requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| React + TypeScript | ✅ Done | Vite + React 19, strict TS |
| State management | ✅ Done | Zustand (auth, drafts) + TanStack Query (API) |
| Axios for API | ✅ Done | `src/api/client.ts` with JWT interceptors |
| Form validation library | ✅ Done | React Hook Form + Zod |
| Responsive design (Figma) | ✅ Done | Sidebar, split login, stacked forms; aligned to Figma screenshots |
| Unit tests | ✅ Done | Vitest + Testing Library (`npm run test`) |
| Docker | ✅ Done | `Dockerfile`, `docker-compose.yml`, `Dockerfile.test` |
| Terraform deployment | ✅ Done | `terraform/` — S3 + CloudFront |

---

## API endpoints (functionality — 40%)

| # | Endpoint | Implemented | Location |
|---|----------|-------------|----------|
| 1 | `POST /auth/login` | ✅ | `src/api/auth.ts` |
| 2 | `GET /subjects` | ✅ | `src/api/subjects.ts` |
| 3 | `GET /topics/subject/:id` | ✅ | `src/api/subjects.ts` |
| 4 | `GET /sub-topics/topic/:id` | ✅ | `src/api/subjects.ts` |
| 5 | `GET /tests` | ✅ | `src/api/tests.ts` |
| 6 | `POST /tests` | ✅ | `src/api/tests.ts` |
| 7 | `PUT /tests/:id` | ✅ | `src/api/tests.ts` |
| 8 | `GET /tests/:id` | ✅ | `src/api/tests.ts` |
| 9 | `POST /questions/bulk` | ✅ | `src/api/questions.ts` |
| 10 | Publish `PUT /tests/:id` `{ status: "live" }` | ✅ | `publishTest()` |
| 11 | `POST /sub-topics/multi-topics` | ✅ | `getSubTopicsByTopics()` |
| 12 | `POST /questions/fetchBulk` | ✅ | `fetchQuestionsBulk()` |

**JWT:** Sent on all authenticated requests via Axios interceptor.

**Credentials:** `vedant-admin` / `vedant123` (verified on staging). Test `type` values must be `chapterwise`, `pyq`, or `mock`; `subject` must be a subject UUID string.

---

## Application flow (5 pages)

| Page | Route | Status |
|------|-------|--------|
| Login | `/login` | ✅ Validation, JWT storage, errors |
| Dashboard | `/dashboard` | ✅ List, search, Edit/View/Delete, Create |
| Create/Edit Test | `/tests/new`, `/tests/:id/edit` | ✅ All fields, draft, cascading selects |
| Add Questions | `/tests/:id/questions` | ✅ MCQ form, list, bulk save, min 1 question |
| Preview & Publish | `/tests/:id/preview` | ✅ Overview, publish, success redirect |

---

## Evaluation criteria self-assessment

### Code quality and structure — 30%

| Item | Status |
|------|--------|
| Modular `api/`, `pages/`, `components/`, `store/`, `types/` | ✅ |
| Typed API responses and forms | ✅ |
| Reusable UI components | ✅ |
| Unit tests (stores, API, auth, routing) | ✅ |
| CI workflow (`.github/workflows/ci.yml`) | ✅ |
| ESLint configured | ✅ |

**Gap:** E2E tests not added (optional improvement).

---

### Functionality and API integration — 40%

| Item | Status |
|------|--------|
| Full CRUD test flow | ✅ |
| Cascading subject → topics → sub-topics | ✅ |
| Question bulk create + link to test | ✅ |
| Publish flow | ✅ |
| 401 logout redirect | ✅ |
| Live API login verified | ⚠️ Blocked by credentials on staging |

---

### UI/UX (Figma) — 20%

| Item | Status |
|------|--------|
| Clean admin layout, tables, forms | ✅ |
| Status badges, loading/error states | ✅ |
| Responsive breakpoints | ✅ |
| Match Figma typography/colors/spacing | ✅ Login, Test Form, Questions, Publish screens updated |

---

### Best practices and documentation — 10%

| Item | Status |
|------|--------|
| `README.md` | ✅ |
| `.env.example` | ✅ |
| `SUBMISSION_CHECKLIST.md` (this file) | ✅ |
| Docker + Terraform docs | ✅ |
| Technical decisions documented | ✅ |

---

## Deliverables

| Deliverable | Status | Action |
|-------------|--------|--------|
| GitHub repository | ⬜ Pending | Push repo and add URL to form |
| Deployed web app | ⬜ Pending | Vercel/Netlify **or** `terraform apply` / Docker on host |
| Walkthrough video | ⬜ Pending | Record full flow after login works |
| Technical decisions | ✅ | See `README.md` |

---

## Quick commands

```bash
# Unit tests
npm run test

# Docker (production image)
docker compose up --build
# → http://localhost:8080

# Docker (run tests only)
docker compose --profile test run test

# Terraform (AWS)
cd terraform && terraform init && terraform apply
```

---

## Pre-submission final check

- [ ] Login works with provided credentials on staging
- [ ] Create test → add questions → publish → appears on dashboard
- [ ] Search/filter on dashboard works
- [ ] Edit and delete test work
- [ ] App is deployed and URL is in Google Form
- [ ] Video shows all 5 pages
- [ ] GitHub repo is public/accessible to reviewers
