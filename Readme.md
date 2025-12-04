# 🔥 Habit Tracker App
A clean and minimal habit-tracking web app where users create habits, mark daily check-ins, and track their streaks over time.
Designed to showcase a complete full-stack workflow including authentication, protected routes, habit CRUD operations, and daily progress tracking.

This project is intentionally lightweight — ideal for interviews where you need to demonstrate clear backend logic and frontend state management without unnecessary complexity.

## 🚀 Features
- Register & login (JWT-based)

- Create habits

- Daily check-ins (✔ Done / ✘ Missed)

- Track streaks automatically

- See check-ins 

- View habit analytics

## Tech Stack

### Frontend
    - React + TypeScript
### Backend
    - Node.js + Express
### DevOps
    - Docker Compose (frontend + backend + MongoDB)

## Project Structure
```css
root/
│
├── habit-tracker-backend/
│   ├── src/
│   ├── Dockerfile
│   ├── .env
│   └── package.json
│
├── habit-tracker-frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```
# ⚙️ Installation (Local Development)
 1. Clone the repository
    * git clone <repo-url>
    * cd <repo-folder>
 2. Install backend dependencies
    * cd habit-tracker-backend
    * npm install
 3. Install frontend dependencies
    * cd habit-tracker-frontend
    * npm install
 4. Environment Variables
 * Create habit-tracker-backend/.env
- MONGO_URL=mongodb://mongo-habit:27017/habitTracker
- JWT_SECRET=****
- CLIENT_URL=http://localhost:5174
- PORT=your_port

 4. Start frontend and backend with
    * npm run dev

## Running with docker
 * From root folder
    ```bash
    docker compose up --build
    docker compose down
    ```

