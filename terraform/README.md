# Terraform — Frontend Deployment (AWS)

Deploys the Preproute Test Management SPA to **S3 + CloudFront**.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.5
- AWS CLI configured (`aws configure`)
- Node.js 22+ (for local build during `terraform apply`)

## Usage

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars if needed

terraform init
terraform plan
terraform apply
```

After apply, open the URL from:

```bash
terraform output cloudfront_url
```

## What it creates

| Resource | Purpose |
|----------|---------|
| S3 bucket | Stores `dist/` static files |
| CloudFront | CDN + HTTPS + SPA routing (403/404 → index.html) |
| OAC + bucket policy | Secure S3 access from CloudFront only |

## API / CORS

The build uses `api_base_url = "/api"`. CloudFront forwards `/api/*` to the staging Railway backend so the browser stays same-origin (no CORS errors).

## Quick deploy script

From the repo root:

```bash
chmod +x scripts/deploy-aws.sh
./scripts/deploy-aws.sh
```

## Notes

- `null_resource.build_frontend` runs `npm run build` before upload.
- First apply creates CloudFront (~5–15 minutes). Updates are faster.
- For production CI/CD, prefer building in GitHub Actions and using `aws s3 sync` instead of local-exec.
- Optional `domain_name` variable is reserved for future ACM/Route53 setup.

## Destroy

```bash
terraform destroy
```
