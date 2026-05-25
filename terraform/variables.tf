variable "project_name" {
  type    = string
  default = "taskflow"
}

variable "aws_region" {
  type    = string
  default = "ap-south-1" # Mumbai Region
}

variable "allowed_ssh_cidr" {
  type    = string
  default = "0.0.0.0/0" # Change to your actual public IP if you want it strict
}

variable "ssh_public_key_path" {
  type    = string
  default = "~/.ssh/id_ed25519.pub"
}

variable "ami_id" {
  type    = string
  default = "ami-03f4878755434977f" # Ubuntu 22.04 LTS in ap-south-1
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}