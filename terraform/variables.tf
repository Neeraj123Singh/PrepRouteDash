variable "aws_region" {
  description = "AWS region for S3 bucket"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "preproute-test-mgmt"
}

variable "environment" {
  description = "Deployment environment (staging, production)"
  type        = string
  default     = "staging"
}

variable "domain_name" {
  description = "Optional custom domain for CloudFront (leave empty to use CloudFront URL only)"
  type        = string
  default     = ""
}

variable "api_base_url" {
  description = "API path baked into the frontend build. Use /api with CloudFront proxy (recommended)."
  type        = string
  default     = "/api"
}

variable "api_origin_domain" {
  description = "Upstream API host (no path) for CloudFront /api/* proxy"
  type        = string
  default     = "admin-moderator-backend-staging.up.railway.app"
}
