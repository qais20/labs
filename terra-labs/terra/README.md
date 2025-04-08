# Terragrunt Lab

This repository provides a Terragrunt lab for deploying basic AWS infrastructure across `dev` and `prod` environments. You'll use Terragrunt to handle environment-specific configurations, enabling easy, consistent, and scalable infrastructure deployment.

## Prerequisites

- Terraform and Terragrunt installed locally
- AWS credentials configured in your environment

## Repository Structure

- `environments/`: Contains configurations for each environment (`dev` and `prod`)
- `modules/`: Contains reusable Terraform code for the VPC

## Setup Instructions

1. **Clone the Repository**:

```bash
cd terragrunt

terragrunt init
terragrunt plan
terragrunt apply
terragrunt destroy
```
