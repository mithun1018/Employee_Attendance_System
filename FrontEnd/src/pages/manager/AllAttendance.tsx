import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllAttendance } from '../../store/slices/attendanceSlice';
import { Search, Filter, Calendar, Users, RefreshCw, X, ClipboardList, Building2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const AllAttendance: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allAttendance, isLoading } = useAppSelector((state) => state.attendance);
  const todayDate = format(new Date(), 'yyyy-MM-dd');
  const [filters, setFilters] = useState({
    date: todayDate,
    status: '',
    search: '',
    department: '',
  });

  // Get unique departments from attendance records (only from database)
  const departments = [...new Set(allAttendance
    .map(record => record.User?.department)
    .filter((dept): dept is string => !!dept && dept.trim() !== '')
  )].sort();

  useEffect(() => {
    // Load today's attendance by default (includes absent employees)
    dispatch(fetchAllAttendance({ date: todayDate }));
  }, [dispatch, todayDate]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    dispatch(
      fetchAllAttendance({
        date: filters.date || undefined,
        status: filters.status || undefined,
        department: filters.department || undefined,
      })
    );
  };

  const clearFilters = () => {
    setFilters({ date: todayDate, status: '', search: '', department: '' });
    dispatch(fetchAllAttendance({ date: todayDate }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return 'badge badge-success';
      case 'late':
        return 'badge badge-warning';
      case 'half-day':
        return 'badge badge-warning';
      case 'absent':
        return 'badge badge-danger';
      default:
        return 'badge badge-neutral';
    }
  };

  const filteredAttendance = allAttendance.filter((record) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const user = record.User;
      if (user) {
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.employeeId?.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      }
    }
    return true;
  });

  return (
    <div className="space-y-8 lg:space-y-10 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">All Attendance</h1>
          <p className="text-gray-500 mt-2">View and filter employee attendance records</p>
        </div>
        <button
          onClick={() => dispatch(fetchAllAttendance())}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 lg:items-end">
          {/* Search */}
          <div className="flex-1">
            <label className="form-label">
              <Search className="w-4 h-4 text-gray-400" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="form-label">
              <Calendar className="w-4 h-4 text-gray-400" />
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="form-input min-w-[160px]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="form-label">
              <Filter className="w-4 h-4 text-gray-400" />
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-input cursor-pointer min-w-[150px]"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="form-label">
              <Building2 className="w-4 h-4 text-gray-400" />
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="form-input cursor-pointer min-w-[150px]"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="btn btn-primary"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">
        <Users className="w-4 h-4" />
        <span>Showing <strong className="text-gray-900">{filteredAttendance.length}</strong> records</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-container border-0 rounded-none">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <span className="text-gray-500">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {record.User?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {record.User?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {record.User?.employeeId || record.User?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.User?.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {format(parseISO(record.date), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.checkInTime
                        ? format(parseISO(record.checkInTime), 'hh:mm a')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.checkOutTime
                        ? format(parseISO(record.checkOutTime), 'hh:mm a')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border ${getStatusBadge(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {record.totalHours ? `${record.totalHours.toFixed(2)} hrs` : '-'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ClipboardList className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No attendance records found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllAttendance;
