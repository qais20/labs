terraform {
  source = "../../modules/ec2"
}

remote_state {
  backend = "s3"
  config = {
    bucket         = "my-tfstate-bucket-qb"
    key            = "dev/terraform.tfstate"
    region         = "eu-west-2" 
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

include {
  path = find_in_parent_folders()
}

inputs = {
  ami           = "ami-0a94c8e4ca2674d5a"
  instance_type = "t2.micro"
  name          = "dev-instance"
}
