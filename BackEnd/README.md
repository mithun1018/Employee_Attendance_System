# Employee Attendance Backend (Auth Scaffold)

This folder contains a minimal Node.js + Express auth scaffold using PostgreSQL and Prisma.

Quick start

1. Copy `.env.example` to `.env` and fill `DATABASE_URL` and `JWT_SECRET`.

2. Install dependencies:

```powershell
cd "BackEnd"
npm install
```

3. Generate Prisma client and run migrations:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

4. Run the dev server:

```powershell
npm run dev
```

Endpoints (auth)

- POST `/api/auth/register`  { name, email, password, role?, department?, employeeId? }
- POST `/api/auth/login`     { email, password }
- GET  `/api/auth/me`        (Authorization: Bearer <token>)

Notes

- This scaffold uses Prisma. You can inspect `prisma/schema.prisma` for the `User` and `Attendance` models.
- After creating the database and setting `DATABASE_URL`, run `npx prisma migrate dev` to create tables.
