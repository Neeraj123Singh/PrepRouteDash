#!/usr/bin/env bash
# Prints copy-paste text for the Preproute Google Form submission.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TF_DIR="$ROOT/terraform"

echo "=============================================="
echo "  Preproute submission — copy-paste helpers"
echo "=============================================="
echo ""

if [[ -d "$TF_DIR" ]] && command -v terraform >/dev/null 2>&1; then
  DEPLOY_URL="$(cd "$TF_DIR" && terraform output -raw cloudfront_url 2>/dev/null || true)"
  if [[ -n "$DEPLOY_URL" ]]; then
    echo "Deployed web application URL:"
    echo "  $DEPLOY_URL"
    echo ""
  fi
fi

echo "Task walkthrough video link:"
echo "  https://YOUR_VIDEO_HOST/watch?v=YOUR_VIDEO_ID"
echo "  (Record using docs/VIDEO_WALKTHROUGH_SCRIPT.md)"
echo ""

echo "Brief explanation of technical decisions:"
echo "----------------------------------------------"
cat <<'EOF'
Stack: React 19, TypeScript, Vite, React Router v7, TanStack Query, Zustand, Axios, React Hook Form, and Zod.

Architecture: TanStack Query owns server state (tests, subjects, topics, questions); Zustand holds the JWT and in-session question drafts before bulk upload. API calls live in src/api/ with a shared Axios client (auth header + 401 redirect).

CORS / API: The staging API blocks browser cross-origin calls. The app uses a same-origin /api path proxied to Railway in dev (Vite), Docker (nginx), and AWS (CloudFront). Production build uses VITE_API_BASE_URL=/api.

Forms & validation: React Hook Form + Zod on login, test create/edit, and MCQ questions. Cascading subject → topic → sub-topic selects; edit mode maps API topic names to dropdown IDs via buildEditFormValues().

Question flow: Questions are edited locally, then POST /questions/bulk and linked with PUT /tests/:id before preview/publish (status: live).

UI: CSS Modules and Figma-aligned tokens; responsive login, dashboard, and question sidebar.

Testing & deploy: Vitest unit tests; Docker for local prod; AWS S3 + CloudFront via scripts/deploy-aws.sh.
EOF
echo "----------------------------------------------"
echo ""
echo "Full form template: docs/SUBMISSION_FORM.md"
echo "Video script:       docs/VIDEO_WALKTHROUGH_SCRIPT.md"
