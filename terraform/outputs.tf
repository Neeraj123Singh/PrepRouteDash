output "s3_bucket_name" {
  description = "S3 bucket hosting the SPA"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_url" {
  description = "Public HTTPS URL for the deployed application"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "api_base_url" {
  description = "API URL configured in the frontend build"
  value       = var.api_base_url
}
