# Google Form — copy-paste answers

Use this when submitting via the [Preproute evaluation form](https://forms.gle/WmZbBQZiLfo8WNn79).

Run `./scripts/print-submission.sh` to print the live deploy URL from Terraform.

---

## GitHub repository URL

```
https://github.com/YOUR_USERNAME/YOUR_REPO
```

Replace with your actual public repository link.

---

## Deployed web application URL

```
https://d33bxno0xyvaq6.cloudfront.net
```

Login: `vedant-admin` / `vedant123`

---

## Task walkthrough video link

```
https://YOUR_VIDEO_HOST/watch?v=YOUR_VIDEO_ID
```

Examples: YouTube (unlisted), Loom, Google Drive (anyone with link).

Paste your link after recording using `docs/VIDEO_WALKTHROUGH_SCRIPT.md`.

---

## Brief explanation of technical decisions

```
Stack: React 19, TypeScript, Vite, React Router v7, TanStack Query, Zustand, Axios, React Hook Form, and Zod.

Architecture: TanStack Query owns server state (tests, subjects, topics, questions); Zustand holds the JWT and in-session question drafts before bulk upload. API calls live in src/api/ with a shared Axios client (auth header + 401 redirect).

CORS / API: The staging API blocks browser cross-origin calls. The app uses a same-origin /api path proxied to Railway in dev (Vite), Docker (nginx), and AWS (CloudFront ordered behavior). The production build sets VITE_API_BASE_URL=/api.

Forms & validation: React Hook Form + Zod on login, test create/edit, and MCQ questions. Cascading subject → topic → sub-topic selects match the API; edit mode resolves API name fields to dropdown IDs via buildEditFormValues().

Question flow: Questions are edited locally, then POST /questions/bulk and linked with PUT /tests/:id before preview/publish (status: live).

UI: CSS Modules and design tokens aligned to Figma; responsive login split layout, dashboard table, and question sidebar.

Testing & deploy: Vitest unit tests; Docker for local production; Terraform deploys S3 + CloudFront (scripts/deploy-aws.sh).
```

---

## Optional shorter version (if the form has a character limit)

```
React 19 + TS, TanStack Query for API data, Zustand for auth and question drafts. Same-origin /api proxy avoids CORS (Vite/Docker/nginx/CloudFront). RHF + Zod validation; cascading selects; bulk questions then publish. Deployed on AWS S3 + CloudFront via Terraform.
```
