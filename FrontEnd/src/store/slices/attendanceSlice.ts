import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Attendance, AttendanceSummary, TodayStatus, DashboardStats } from '../../types';
import attendanceService from '../../services/attendanceService';

interface AttendanceState {
  todayAttendance: Attendance | null;
  history: Attendance[];
  summary: AttendanceSummary | null;
  allAttendance: Attendance[];
  todayStatus: TodayStatus[];
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  todayAttendance: null,
  history: [],
  summary: null,
  allAttendance: [],
  todayStatus: [],
  dashboardStats: null,
  isLoading: false,
  error: null,
};

// Employee thunks
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const data = await attendanceService.checkIn();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed');
    }
  }
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const data = await attendanceService.checkOut();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Check-out failed');
    }
  }
);

export const fetchMyHistory = createAsyncThunk(
  'attendance/fetchMyHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceService.getMyHistory();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  }
);

export const fetchMySummary = createAsyncThunk(
  'attendance/fetchMySummary',
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceService.getMySummary();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch summary');
    }
  }
);

export const fetchTodayAttendance = createAsyncThunk(
  'attendance/fetchTodayAttendance',
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceService.getTodayAttendance();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today attendance');
    }
  }
);

// Manager thunks
export const fetchAllAttendance = createAsyncThunk(
  'attendance/fetchAllAttendance',
  async (filters: { date?: string; status?: string; userId?: number } | undefined, { rejectWithValue }) => {
    try {
      return await attendanceService.getAllAttendance(filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'attendance/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceService.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchTodayStatus = createAsyncThunk(
  'attendance/fetchTodayStatus',
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceService.getTodayStatus();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today status');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check In
      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayAttendance = action.payload.data;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check Out
      .addCase(checkOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayAttendance = action.payload.data;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch History
      .addCase(fetchMyHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchMyHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Summary
      .addCase(fetchMySummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      // Fetch Today Attendance
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.todayAttendance = action.payload;
      })
      // Fetch All Attendance (Manager)
      .addCase(fetchAllAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allAttendance = action.payload;
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      })
      // Fetch Today Status
      .addCase(fetchTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload;
      });
  },
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
