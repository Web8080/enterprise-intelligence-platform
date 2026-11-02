variable "aws_region" {
  description = "AWS region used for deployment resources."
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Unique project code used for resource naming."
  type        = string
  default     = "eip"
}
