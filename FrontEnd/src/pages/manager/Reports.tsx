import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllAttendance } from '../../store/slices/attendanceSlice';
import attendanceService from '../../services/attendanceService';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';

const Reports: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allAttendance, isLoading } = useAppSelector((state) => state.attendance);
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    status: '',
  });
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    dispatch(fetchAllAttendance({
      startDate: filters.startDate,
      endDate: filters.endDate,
    }));
  }, [dispatch]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    dispatch(
      fetchAllAttendance({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
      })
    );
  };

  const handleExportCSV = async () => {
    setExporting(true);
    setExportMessage(null);
    try {
      const blob = await attendanceService.exportAttendance({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportMessage({ type: 'success', text: 'Report exported successfully!' });
    } catch (error: any) {
      setExportMessage({ type: 'error', text: 'Failed to export report. Please try again.' });
    } finally {
      setExporting(false);
      setTimeout(() => setExportMessage(null), 4000);
    }
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

  // Calculate summary stats
  const summary = {
    total: allAttendance.length,
    present: allAttendance.filter((r) => r.status === 'present').length,
    late: allAttendance.filter((r) => r.status === 'late').length,
    absent: allAttendance.filter((r) => r.status === 'absent').length,
    halfDay: allAttendance.filter((r) => r.status === 'half-day').length,
  };

  const summaryCards = [
    {
      title: 'Total Records',
      value: summary.total,
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Present',
      value: summary.present,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Late',
      value: summary.late,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Half Day',
      value: summary.halfDay,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Absent',
      value: summary.absent,
      icon: XCircle,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-8 lg:space-y-10 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-2">Generate and export attendance reports</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting || allAttendance.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export CSV
            </>
          )}
        </button>
      </div>

      {/* Export Message */}
      {exportMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-slideIn ${
            exportMessage.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
          }`}
        >
          {exportMessage.type === 'success' ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
          <span className="font-medium">{exportMessage.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="filter-section">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Filter className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filter Options</h2>
            <p className="text-sm text-gray-500">Customize your report data</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Start Date */}
          <div>
            <label className="form-label">
              <Calendar className="w-4 h-4 text-gray-400" />
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="form-input"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="form-label">
              <Calendar className="w-4 h-4 text-gray-400" />
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="form-input"
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
              className="form-input cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className="card card-hover p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Report Data</h2>
              <p className="text-sm text-gray-500">{allAttendance.length} records found</p>
            </div>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
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
                  <td colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <span className="text-gray-500">Loading report data...</span>
                    </div>
                  </td>
                </tr>
              ) : allAttendance.length > 0 ? (
                allAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td>
                      <span className="text-sm font-semibold text-gray-900">
                        {record.User?.employeeId || '-'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {record.User?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {record.User?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="text-gray-600">
                      {record.User?.department || '-'}
                    </td>
                    <td>
                      <span className="text-sm font-medium text-gray-900">
                        {format(parseISO(record.date), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="text-gray-600">
                      {record.checkInTime
                        ? format(parseISO(record.checkInTime), 'hh:mm a')
                        : '-'}
                    </td>
                    <td className="text-gray-600">
                      {record.checkOutTime
                        ? format(parseISO(record.checkOutTime), 'hh:mm a')
                        : '-'}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-gray-900">
                        {record.totalHours ? `${record.totalHours.toFixed(2)} hrs` : '-'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No records found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filter criteria</p>
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

export default Reports;
