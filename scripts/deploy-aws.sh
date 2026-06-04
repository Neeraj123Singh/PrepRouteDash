#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TF_DIR="$ROOT/terraform"

cd "$TF_DIR"

if [[ ! -f terraform.tfvars ]]; then
  cp terraform.tfvars.example terraform.tfvars
  echo "Created terraform/terraform.tfvars from example."
fi

terraform init -input=false
terraform apply -auto-approve -input=false

echo ""
echo "Deployed successfully."
terraform output cloudfront_url
terraform output api_base_url
