output "instance_public_ip" {
  description = "Public IP of the TaskFlow EC2 instance."
  value       = aws_instance.app.public_ip
}

output "app_url" {
  description = "HTTP URL for the deployed app."
  value       = "http://${aws_instance.app.public_ip}"
}
