import api from './api';
import { Attendance, AttendanceSummary, TodayStatus } from '../types';

export const attendanceService = {
  // Employee endpoints
  async checkIn(): Promise<{ message: string; data: Attendance }> {
    const response = await api.post('/attendance/checkin');
    return response.data;
  },

  async checkOut(): Promise<{ message: string; data: Attendance }> {
    const response = await api.post('/attendance/checkout');
    return response.data;
  },

  async getMyHistory(): Promise<Attendance[]> {
    const response = await api.get('/attendance/my-history');
    return response.data;
  },

  async getMySummary(): Promise<AttendanceSummary> {
    const response = await api.get('/attendance/my-summary');
    return response.data;
  },

  async getTodayAttendance(): Promise<Attendance | null> {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  // Manager endpoints
  async getAllAttendance(filters?: {
    date?: string;
    status?: string;
    userId?: number;
  }): Promise<Attendance[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.userId) params.append('userId', filters.userId.toString());
    
    const response = await api.get(`/manager/attendance?${params.toString()}`);
    return response.data;
  },

  async getEmployeeAttendance(userId: number): Promise<Attendance[]> {
    const response = await api.get(`/manager/attendance/${userId}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/manager/dashboard');
    return response.data;
  },

  async getTodayStatus(): Promise<TodayStatus[]> {
    const response = await api.get('/manager/today-status');
    return response.data;
  },

  async exportAttendance(filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    userId?: number;
  }): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.userId) params.append('userId', filters.userId.toString());

    const response = await api.get(`/manager/attendance/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default attendanceService;
