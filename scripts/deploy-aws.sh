#!/usr/bin/env bash
# Build the SPA and deploy to AWS (S3 + CloudFront + /api proxy).
# Prerequisites: AWS CLI configured, Terraform >= 1.5, Node.js 22+
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TF_DIR="$ROOT/terraform"
API_BASE="${VITE_API_BASE_URL:-/api}"
INVALIDATE="${INVALIDATE_CLOUDFRONT:-true}"

usage() {
  cat <<EOF
Usage: ./scripts/deploy-aws.sh [options]

Options:
  --skip-build     Skip npm ci / npm run build (use existing dist/)
  --invalidate     Force CloudFront cache invalidation after apply
  --no-invalidate  Skip CloudFront invalidation
  -h, --help       Show this help

Environment:
  VITE_API_BASE_URL=/api     Baked into the build (default: /api)
  INVALIDATE_CLOUDFRONT=true Set to false to skip invalidation

Examples:
  ./scripts/deploy-aws.sh
  ./scripts/deploy-aws.sh --skip-build --invalidate
EOF
}

SKIP_BUILD=false
FORCE_INVALIDATE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --invalidate)
      FORCE_INVALIDATE=true
      INVALIDATE=true
      shift
      ;;
    --no-invalidate)
      INVALIDATE=false
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if ! command -v aws >/dev/null 2>&1; then
  echo "Error: AWS CLI is not installed. Install it and run 'aws configure'." >&2
  exit 1
fi

if ! command -v terraform >/dev/null 2>&1; then
  echo "Error: Terraform is not installed." >&2
  exit 1
fi

echo "==> Checking AWS credentials..."
aws sts get-caller-identity >/dev/null

if [[ "$SKIP_BUILD" == false ]]; then
  echo "==> Building frontend (VITE_API_BASE_URL=$API_BASE)..."
  cd "$ROOT"
  npm ci
  VITE_API_BASE_URL="$API_BASE" npm run build
else
  echo "==> Skipping build (using existing dist/)..."
  if [[ ! -f "$ROOT/dist/index.html" ]]; then
    echo "Error: dist/index.html not found. Run without --skip-build first." >&2
    exit 1
  fi
fi

cd "$TF_DIR"

if [[ ! -f terraform.tfvars ]]; then
  cp terraform.tfvars.example terraform.tfvars
  echo "==> Created terraform/terraform.tfvars from example."
fi

echo "==> Terraform init..."
terraform init -input=false

echo "==> Terraform apply..."
terraform apply -auto-approve -input=false

DEPLOY_URL="$(terraform output -raw cloudfront_url)"
DIST_ID="$(terraform output -raw cloudfront_distribution_id)"

echo ""
echo "=============================================="
echo "  Deployed successfully"
echo "=============================================="
echo "  URL:      $DEPLOY_URL"
echo "  API path: $API_BASE (proxied via CloudFront)"
echo "  Login:    vedant-admin / vedant123"
echo "=============================================="

if [[ "$INVALIDATE" == true || "$FORCE_INVALIDATE" == true ]]; then
  echo "==> Invalidating CloudFront cache (/*)..."
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text
  echo "    Invalidation submitted. Changes may take 1–5 minutes."
fi

echo ""
echo "Submission text: ./scripts/print-submission.sh"
