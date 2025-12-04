# 🔥 Real-Time Habit Tracker App
A collaborative habit-tracking platform where users create habits, perform daily check-ins, and see real-time updates across groups using Socket.io.

Designed as a simple but powerful clone of HabitShare — perfect for demonstrating real-time features in interviews.

## 🚀 Features
- Register & login (JWT-based)

- Create habits

- Daily check-ins (✔ Done / ✘ Missed)

- Track streaks automatically

- See check-ins of group members

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

