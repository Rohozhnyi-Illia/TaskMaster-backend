# TaskMaster Backend

Backend API for managing tasks, notifications, and users. Built with Node.js, Express, and MongoDB.

## Features

- User registration and login
- Password update (current version: without email confirmation)
- Create and delete tasks
- Task notifications (reminders, deadlines, overdue alerts)
- JWT-based authentication (access and refresh tokens)

## Technologies

- Node.js / Express
- MongoDB / Mongoose
- JWT (JSON Web Token)
- bcrypt for password hashing
- dotenv for environment configuration
- Supertest + Jest for testing

## Installation

1. `git clone <https://github.com/Rohozhnyi-Illia/TaskMaster-backend.git>`
2. `cd TaskMaster-backend`
3. `npm install`
4. `cp .env.example .env`

## Running

- `npm run dev` — development mode
- `npm start` — production mode

Default server URL: http://localhost:6000.

## Testing

- `npm run test`

## API Endpoints

- `/api/auth/register` — register a new user
- `/api/auth/login` — login
- `/api/auth/update-password` — update password
- `/api/auth/logout` — logout
- `/api/auth/refresh` — refresh token
- `/api/tasks/add-task` — create a task
- `/api/tasks/:id` — delete a task
- `/api/notification/get-notification` — get user notifications
- `/api/notification/:id/read` — mark notification as read
- `/api/notification/:id` — delete notification

## Notes

- First version of the project, no email integration yet
- Password can be updated only on the registration/login page
