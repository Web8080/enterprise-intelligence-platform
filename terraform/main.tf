terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "data_landing" {
  bucket = "${var.project_name}-data-landing-${var.environment}"
  force_destroy = true

  tags = {
    Name        = "${var.project_name}-landing"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_s3_bucket" "curated_data" {
  bucket = "${var.project_name}-curated-${var.environment}"
  force_destroy = true

  tags = {
    Name        = "${var.project_name}-curated"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_s3_bucket" "audit_logs" {
  bucket = "${var.project_name}-audit-${var.environment}"
  force_destroy = true

  tags = {
    Name        = "${var.project_name}-audit"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_log_group" "platform_logs" {
  name              = "/aws/${var.project_name}/${var.environment}"
  retention_in_days = 30

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_iam_role" "platform_exec" {
  name = "${var.project_name}-exec-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

output "landing_bucket_name" {
  value = aws_s3_bucket.data_landing.bucket
}

output "curated_bucket_name" {
  value = aws_s3_bucket.curated_data.bucket
}

output "audit_bucket_name" {
  value = aws_s3_bucket.audit_logs.bucket
}

output "cloudwatch_log_group" {
  value = aws_cloudwatch_log_group.platform_logs.name
}
