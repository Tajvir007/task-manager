# DevOps Task Manager

A beginner-friendly Task Management application built as the first application for a larger DevOps practice journey.

## Phase 1 stack

- Frontend: HTML + CSS + JavaScript
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- API: REST
- Health endpoints: `/health` and `/ready`

## Features

- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Change task status
- Set task priority
- Search tasks
- Filter by status
- Dashboard statistics
- Responsive UI
- Light/dark mode
- Health and readiness endpoints

## Project structure

```text
devops-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Requirements

Install these before running:

- Node.js 20+ recommended
- npm
- MongoDB Community Server running locally

## 1. Start MongoDB

Make sure MongoDB is running on:

```text
mongodb://127.0.0.1:27017
```

## 2. Configure backend

```bash
cd backend
cp .env.example .env
npm install
```

On Windows PowerShell, if `cp` does not work:

```powershell
Copy-Item .env.example .env
```

## 3. Start backend

Development mode:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

Test it:

```bash
curl http://localhost:5000/health
curl http://localhost:5000/ready
curl http://localhost:5000/api/tasks
```

## 4. Start frontend

Open a second terminal:

```bash
cd frontend
```

If Python is installed:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

You can also use VS Code Live Server.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/health` | Liveness check |
| GET | `/ready` | Readiness check |

## Example POST

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker","description":"Build my first container","priority":"high","status":"pending"}'
```

## DevOps roadmap after Phase 1

Do not add these yet. They are the next phases:

```text
Phase 1  Application
   ↓
Phase 2  Git + GitHub
   ↓
Phase 3  Docker
   ↓
Phase 4  Docker Compose
   ↓
Phase 5  Automated Tests
   ↓
Phase 6  Jenkins CI/CD
   ↓
Phase 7  SonarQube + Trivy
   ↓
Phase 8  Terraform
   ↓
Phase 9  Ansible
   ↓
Phase 10 AWS
   ↓
Phase 11 ECR + ECS + ALB
   ↓
Phase 12 CloudWatch + Monitoring
   ↓
Phase 13 Kubernetes
   ↓
Phase 14 EKS
   ↓
Phase 15 Prometheus + Grafana
   ↓
Phase 16 GitOps / Argo CD
```

## Important

This repository intentionally keeps Phase 1 simple. The architecture will evolve as we apply DevOps practices to the same application.
