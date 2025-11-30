# Employee Attendance System

A modern, full-stack employee attendance management system built with React, Node.js, Express, and PostgreSQL. Features real-time attendance tracking, team management, and comprehensive reporting.

![AttendanceHub](https://img.shields.io/badge/AttendanceHub-Workforce%20Management-667eea)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)

## 📋 Features

### Employee Features
- ✅ Check-in / Check-out with real-time clock
- 📅 View attendance history with calendar view
- 📊 Personal attendance summary and statistics
- 👤 Profile management

### Manager Features
- 👥 View all employees' attendance records
- 📈 Dashboard with team statistics and charts
- 📆 Team calendar view
- 📄 Generate and export attendance reports (CSV)
- 🔍 Filter attendance by date, status, and employee

## 🛠️ Tech Stack

### Frontend
- React 19.1 with TypeScript
- Redux Toolkit for state management
- React Router DOM for navigation
- Tailwind CSS for styling
- Vite for build tooling
- Recharts for data visualization
- Lucide React for icons
- date-fns for date formatting

### Backend
- Node.js with Express
- TypeScript
- Sequelize ORM
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing

## 📦 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/mithun1018/Employee_Attendance_System.git
cd Employee_Attendance_System
```

### 2. Backend Setup
```bash
cd BackEnd
npm install
```

### 3. Frontend Setup
```bash
cd FrontEnd
npm install
```

### 4. Database Setup
Create a PostgreSQL database named `employee_attendance` (or your preferred name).

## ⚙️ Environment Variables

### Backend (.env)
Create a `.env` file in the `BackEnd` directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_attendance
DB_USER=your_db_username
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

### Frontend
The frontend uses Vite and connects to the backend API. Update the API base URL in `FrontEnd/src/services/api.ts` if needed:

```typescript
const API_URL = 'http://localhost:5000/api';
```

## 🚀 How to Run

### Running the Backend
```bash
cd BackEnd
npm run dev
```
The backend server will start at `http://localhost:5000`

### Running the Frontend
```bash
cd FrontEnd
npm run dev
```
The frontend will start at `http://localhost:3000`

### Running Both (Full Application)
Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd BackEnd
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd FrontEnd
npm run dev
```

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
*Modern login interface with gradient background*

### Employee Dashboard
![Employee Dashboard](screenshots/employee-dashboard.png)
*Employee view with attendance stats and quick actions*

### Mark Attendance
![Mark Attendance](screenshots/mark-attendance.png)
*Real-time clock with check-in/check-out functionality*

### Attendance History
![Attendance History](screenshots/attendance-history.png)
*Calendar and table view of attendance records*

### Manager Dashboard
![Manager Dashboard](screenshots/manager-dashboard.png)
*Team overview with charts and statistics*

### All Attendance (Manager)
![All Attendance](screenshots/all-attendance.png)
*View and filter all employee attendance records*

### Reports
![Reports](screenshots/reports.png)
*Generate and export attendance reports*

### Team Calendar
![Team Calendar](screenshots/team-calendar.png)
*Visual calendar showing team attendance*

## 📁 Project Structure

```
Employee_Attendance_System/
├── BackEnd/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── employee/       # Employee module
│   │   ├── manager/        # Manager module
│   │   ├── middlewares/    # Auth & role middlewares
│   │   ├── models/         # Sequelize models
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
├── FrontEnd/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store & slices
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Employee
- `POST /api/employee/check-in` - Check in
- `POST /api/employee/check-out` - Check out
- `GET /api/employee/today` - Get today's attendance
- `GET /api/employee/history` - Get attendance history
- `GET /api/employee/summary` - Get attendance summary

### Manager
- `GET /api/manager/attendance` - Get all attendance
- `GET /api/manager/dashboard` - Get dashboard stats
- `GET /api/manager/today-status` - Get today's status
- `GET /api/manager/export` - Export attendance CSV

## 👨‍💻 Author

**Mithun**
- GitHub: [@mithun1018](https://github.com/mithun1018)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ Star this repository if you find it helpful!