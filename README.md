# ⚡ TaskFlow

TaskFlow is a production-grade, full-stack task management ecosystem built to demonstrate modern DevOps architectures, Infrastructure as Code (IaC), containerized microservices, and continuous automation.

[![CI/CD Pipeline](https://img.shields.io/github/actions/workflow/status/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/deploy.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white&label=CI%2FCD%20Deploy)](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/actions)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS EC2](https://img.shields.io/badge/AWS-EC2%20Deployed-orange?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

🔗 **Project Reference:** Developed in alignment with the [roadmap.sh Multi-Container Service Challenge](https://roadmap.sh/projects/multi-container-service).

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies Used | Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | `React 19` `TypeScript` `Vite` `TailwindCSS` | Responsive task boards, optimized server-state caching via `TanStack Query`, robust network routing. |
| **Backend** | `Node.js` `Express` `Prisma ORM` `Zod` | Type-safe RESTful API architecture, input layer validations, and high-performance relational database mapping. |
| **Database** | `PostgreSQL 16` | Persistent transactional relational storage with localized structural schema control. |
| **DevOps & Infrastructure** | `Docker` `Docker Compose` `Nginx` `Terraform` `Ansible` | Local environment replication, edge reverse-proxy matching, immutable cloud provisioning, and environment scaling. |

---

## 🚀 Key Features

* **Complete Task Lifecycle:** Full CRUD operational support designed with strict input payload sanitation via Zod.
* **Isolated Multi-Container Ecosystem:** Isolated networks keeping the PostgreSQL layer decoupled from outside web exposure.
* **Nginx Reverse Proxy:** Unified traffic routing directing client request boundaries across specific container boundaries seamlessly.
* **Infrastructure as Code (IaC):** Single-command reproducible hardware definitions utilizing HashiCorp Terraform alongside declarative Ansible scripts.
* **Automated CI/CD Blueprint:** Production pipeline running integration compilation checks prior to rolling container deployments.

---

## 🗺️ CI/CD GitOps Pipeline Architecture

TaskFlow utilizes an automated **GitOps continuous delivery cycle** powered by GitHub Actions. Every single code adjustment pushed to production is vetted, verified, and shipped without manual interaction.

```mermaid
graph LR
    A[Local Code Push] -->|git push origin main| B(GitHub Actions Runner)
    B --> C{Step 1: Validate Matrix}
    C -->|Frontend Build Check| D[npm run build]
    C -->|Backend Engine Check| E[prisma generate && tsc]
    D & E -->|All Checks Pass| F(Step 2: Deploy Job)
    F -->|Secure SSH Tunnel| G[AWS EC2 Target Instance]
    G -->|Fetch Source Delta| H[git pull origin main]
    H -->|Zero-Downtime Swap| I[sudo docker compose up --build -d]
