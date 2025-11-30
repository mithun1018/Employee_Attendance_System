// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'employee' | 'manager';
  employeeId: string;
  department: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'employee' | 'manager';
  department?: string;
  employeeId?: string;
}

// Attendance types
export interface Attendance {
  id: number;
  userId: number;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  totalHours: number | null;
  createdAt?: string;
  User?: User;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  totalHours: number;
}

export interface DashboardStats {
  totalEmployees?: number;
  today: {
    present: number;
    absent: number;
    late: number;
    halfDay: number;
  };
}

export interface EmployeeDashboardStats {
  todayStatus: Attendance | null;
  monthlySummary: AttendanceSummary;
  recentAttendance: Attendance[];
}

export interface TodayStatus {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkInTime: string | null;
  checkOutTime: string | null;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
