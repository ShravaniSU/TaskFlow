````markdown
# TaskFlow

TaskFlow is a production-style full-stack task management application built to practice modern DevOps workflows and multi-container deployments. The project includes a React frontend, Express backend, PostgreSQL database, Docker Compose setup, Terraform infrastructure provisioning, Ansible configuration management, and CI/CD automation.

🔗 Project Reference:  
https://roadmap.sh/projects/multi-container-service

---

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TanStack Query
- Axios
- TailwindCSS

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Zod Validation

### DevOps
- Docker
- Docker Compose
- Nginx
- Terraform
- Ansible
- GitHub Actions
- AWS EC2

---

## Features
- Full CRUD task management
- PostgreSQL database integration
- REST API architecture
- Dockerized multi-container setup
- Reverse proxy with Nginx
- Infrastructure as Code using Terraform
- Automated deployment with GitHub Actions
- Production-ready backend structure

---

## Run Locally

### Start PostgreSQL

```bash
docker run -d \
  --name taskflow-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=taskflow \
  -p 5432:5432 \
  postgres:16-alpine
````

### Start Backend

```bash
cd backend
npm install
npm run dev
```

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

Built by Shravani Urankar 🚀

```
```
