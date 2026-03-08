# TaskMaster Backend

Backend API for managing users, tasks, and notifications.  
Built with **Node.js**, **Express**, and **MongoDB** — now with **email verification, password recovery, automated testing, and code quality tools**

---

## Features

- User registration, login, and logout
- **Email verification via Brevo (custom domain integration)**
- **Password recovery with email verification**
- Create, update, and delete tasks
- Task notifications (reminders, deadlines, overdue alerts)
- JWT-based authentication (access + refresh tokens)
- Automated API testing (Jest + Supertest)
- Code quality tools (ESLint + Prettier)
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
- **Jest + Supertest** — API testing
  **MongoMemoryServer** — in-memory MongoDB for isolated tests
- **ESLint** — code linting
- **Prettier** — code formatting

---

## Installation

```bash
git clone https://github.com/Rohozhnyi-Illia/TaskMaster-backend.git
cd TaskMaster-backend
npm install
cp .env.example .env
```

---

## Running

```bash
npm run dev     # development mode
npm start       # production mode
```

Default server URL: http://localhost:9000.

---

### Scripts

```bash
npm start        # start server in production
npm run dev      # start server in development mode
npm run lint     # run ESLint
npm run lint:fix # fix lint issues automatically
npm run format   # format code with Prettier
npm test         # run tests
npm run coverage # generate test coverage report
```

---

## API Endpoints

### Auth Routes (`/api/auth`)

- `POST /register` — register a new user
- `POST /re-verify-email` — resend verification email
- `POST /verify-email` — verify user email
- `POST /login` — login user
- `POST /update-password` — request password reset (send code to email)
- `POST /verify-password` — verify code and update password
- `POST /logout` — logout user
- `POST /refresh` — refresh JWT tokens

---

### Task Routes (`/api/tasks`)

- `GET /` — get all tasks for the current user
- `POST /` — create a new task
- `DELETE /:id` — delete a task
- `PATCH /:id/status` — update task status (Active / Done / In-progress / Archived / Blocked)
- `PATCH /:id/category` - update task category (Critical / High / Middle / Low)
- `PATCH /reorder` - change the order of tasks

---

### Notification Routes (`/api/notification`)

- `GET /` — get user notifications
- `PATCH /:id/read` — mark notification as read
- `PATCH /readAll` — delete all read notifications
- `PATCH /deleteAll` — delete all notifications
- `DELETE /:id` — delete a single notification

---

### Utility Routes

- `/ping` — checks whether the server and MongoDB are working (used by a third-party service)

---

### Testing

The project includes integration tests for the API using **Jest** and **Supertest**.

Tests run against an **in-memory MongoDB instance (MongoMemoryServer)**, ensuring  
test isolation and preventing interaction with the production database.

```bash
Statements : 92.33%
Branches   : 71.52%
Functions  : 97.33%
Lines      : 92.79%

Test Suites: 17
Tests: 50
Status: All passing
```

Tests cover:

- Authentication flow
- Token refresh
- Task creation and management
- Notifications
- Email verification
- Password recovery
- Authorization middleware

---

## How Email Verification Works

1. User registers — server generates a 6-digit code via crypto.randomInt().
2. Code is stored in DB and expires after 15 minutes.
3. Code is sent via Brevo or local SMTP during development.
4. User submits the code via /verify-email.
5. On success — account status updates to emailActivated: true.
6. The same flow is used for password recovery.

---

### Code Quality

The project enforces consistent code style using:

- ESLint — static code analysis
- Prettier — automatic code formatting

This ensures consistent and maintainable code across the project.

---

## Notes

- Verification codes expire after 15 minutes
- Integrated with Brevo for production email delivery
- /ping route allows uptime services to keep server and DB awake
- Automated tests ensure API reliability
- Project version v2.1.0

---

## Author

Illia Rohozhnyi
