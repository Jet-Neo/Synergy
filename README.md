# Synergy – Smart Team Productivity & Burnout Detection System

![Synergy Banner](https://img.shields.io/badge/Status-In%20Development-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)
![ASP.NET](https://img.shields.io/badge/Backend-ASP.NET%20Core-512BD4?style=for-the-badge\&logo=dotnet\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge\&logo=postgresql\&logoColor=white)
![AWS](https://img.shields.io/badge/Hosted%20On-AWS-FF9900?style=for-the-badge\&logo=amazonaws\&logoColor=white)

## Overview

**Synergy** is a full-stack productivity and analytics platform designed to help teams manage projects, monitor workloads, and detect signs of burnout before they become major issues.

The system combines task management, team collaboration, work logging, and productivity analytics into a modern and intuitive dashboard experience.

This project was developed as a senior capstone project for the Computer Science program at the University of Houston–Clear Lake.

---

## Features

### Team Management

* Create and manage teams
* Assign users to teams
* Edit or remove team members
* View detailed team information

### Task Management

* Create, edit, and delete tasks
* Assign tasks to specific team members
* Set deadlines and priorities
* Track task progress
* Filter and sort tasks dynamically

### Work Logs

* Log hours worked on tasks
* Prevent work logging on completed tasks
* Automatically sort newest logs first
* Track productivity over time

### Analytics Dashboard

* Team productivity tracking
* Workload distribution visualization
* Burnout risk indicators
* Productivity trend analysis
* Team performance insights

### Authentication System

* User login system
* Session management
* Secure API communication

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Tailwind-inspired custom styling
* Lucide React Icons

### Backend

* ASP.NET Core Web API (.NET 8)
* Entity Framework Core
* REST API Architecture

### Database

* PostgreSQL
* AWS RDS

### Deployment & Cloud

* AWS EC2
* AWS RDS
* Nginx Reverse Proxy

---

## System Architecture

```text
Frontend (React + Vite)
        ↓
ASP.NET Core Web API
        ↓
Entity Framework Core
        ↓
PostgreSQL Database (AWS RDS)
```

---

## Database Tables

| Table Name   | Purpose                         |
| ------------ | ------------------------------- |
| users        | Stores user accounts            |
| teams        | Stores team information         |
| team_members | Links users to teams            |
| tasks        | Stores task data                |
| work_logs    | Stores logged work hours        |
| sessions     | Handles authentication sessions |

---

## Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Jet-Neo/synergy.git
cd synergy
```

---

## 2. Frontend Setup

Navigate to the frontend folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 3. Backend Setup

Navigate to the backend folder:

```bash
cd server
```

Restore dependencies:

```bash
dotnet restore
```

Run the API:

```bash
dotnet run
```

Backend API will run on:

```text
https://localhost:5018
```

Swagger API documentation:

```text
https://localhost:5018/swagger
```

---

## 4. Database Configuration

Update your `appsettings.json` file:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=YOUR_HOST;Port=5432;Database=YOUR_DATABASE;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
  }
}
```

Apply migrations:

```bash
dotnet ef database update
```

---

## API Endpoints

### Tasks

| Method | Endpoint        | Description   |
| ------ | --------------- | ------------- |
| GET    | /api/tasks      | Get all tasks |
| POST   | /api/tasks      | Create task   |
| PUT    | /api/tasks/{id} | Update task   |
| DELETE | /api/tasks/{id} | Delete task   |

### Work Logs

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| GET    | /api/worklogs | Get all work logs |
| POST   | /api/worklogs | Create work log   |

### Teams

| Method | Endpoint   | Description   |
| ------ | ---------- | ------------- |
| GET    | /api/teams | Get all teams |
| POST   | /api/teams | Create team   |

---

## Project Structure

```text
Synergy/
│
├── client/                 # React Frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── server/                 # ASP.NET Core Backend
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Services/
│   └── Migrations/
│
└── README.md
```

---

## UI Design Goals

Synergy was designed with a modern productivity-focused aesthetic:

* Dark theme interface
* Green accent color palette
* Minimal and professional dashboard layouts
* Responsive card-based design
* User-friendly analytics visualization

---

## Future Improvements

* Real-time notifications
* AI-powered burnout prediction
* Team messaging system
* Calendar integration
* Mobile responsiveness improvements
* Docker container deployment
* Advanced analytics reports

---

## Contributors

Developed by the Synergy Senior Project Team.

### Main Roles

* Frontend Development
* Backend API Development
* Database Design
* Analytics System Development
* AWS Deployment & Infrastructure

---

## License

This project is for educational and academic purposes.

---

## Contact

For questions or collaboration:

* GitHub: [https://github.com/Jet-Neo](https://github.com/Jet-Neo)
* Project Name: Synergy
