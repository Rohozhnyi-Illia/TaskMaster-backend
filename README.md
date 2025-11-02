# TaskMaster Backend

Backend API for managing users, tasks, and notifications.  
Built with **Node.js**, **Express**, and **MongoDB** — now with **email verification and password recovery**.

---

## Features

- User registration, login, and logout
- **Email verification via Brevo (custom domain integration)**
- **Password recovery with email verification**
- Create, update, and delete tasks
- Task notifications (reminders, deadlines, overdue alerts)
- JWT-based authentication (access + refresh tokens)
- Health check route (`/ping`) for uptime monitoring (keeps server and DB awake)
- Secure verification code generation using Node.js `crypto` (6-digit code, expires in 15 minutes)

---

## 🛠 Technologies

- **Node.js / Express**
- **MongoDB / Mongoose**
- **JWT** (JSON Web Token)
- **bcrypt** — password hashing
- **crypto** — secure code generation for email verification
- **dotenv** — environment configuration
- **nodemailer + Brevo (Sendinblue)** — email delivery
- **Supertest + Jest** — testing

---

## Installation

```bash
git clone https://github.com/Rohozhnyi-Illia/TaskMaster-backend.git
cd TaskMaster-backend
npm install
cp .env.example .env

## Running

npm run dev     # development mode
npm start       # production mode

Default server URL: http://localhost:9000.

## Testing

- `npm run test`

##  API Endpoints

### Auth Routes
- `/api/auth/register` — register a new user
- `/api/auth/re-verify-email` — resend verification email
- `/api/auth/verify-email` — verify user email
- `/api/auth/login` — login user
- `/api/auth/update-password` — request password reset (send code to email)
- `/api/auth/verify-password` — verify code and update password
- `/api/auth/logout` — logout user
- `/api/auth/refresh` — refresh JWT tokens

---

### Task Routes
- `/api/tasks/get-all` — get all tasks for the current user
- `/api/tasks/add-task` — create a new task
- `/api/tasks/:id/status` — update task status (Active / Done)
- `/api/tasks/:id` — delete a task

---

### 🔔 Notification Routes
- `/api/notification/get-notification` — get user notifications
- `/api/notification/:id/read` — mark notification as read
- `/api/notification/:id` — delete a notification

---

### Utility Routes
- `/ping` — checks whether the server and MongoDB are working (used by a third-party service)

---

## How Email Verification Works

1. User registers — server generates a 6-digit code via crypto.randomInt().
2. Code is stored in DB  and expires after 15 minutes.
3. Code is sent via Brevo  or local SMTP during development.
4. User submits the code via /verify-email.
5. On success — account status updates to emailActivated: true.
6. The same flow is used for password recovery.

## Notes

- Verification codes expire after 15 minutes.
- Integrated with Brevo for production email delivery.
- /ping route allows uptime services (e.g. cron-job) to keep server and DB awake.
- Local SMTP configuration available for development.
- Project version v2.0.0 — includes email verification and notifications.

---

## Author

Illia Rohozhnyi
```
