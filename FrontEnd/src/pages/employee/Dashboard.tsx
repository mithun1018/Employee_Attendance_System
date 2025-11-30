import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchTodayAttendance,
  fetchMyHistory,
  fetchMySummary,
  checkIn,
  checkOut,
} from '../../store/slices/attendanceSlice';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Timer,
  ArrowRight,
  Zap,
  Target,
  Award,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const EmployeeDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { todayAttendance, history, summary, isLoading } = useAppSelector(
    (state) => state.attendance
  );
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const hasCheckedIn = todayAttendance && todayAttendance.checkInTime;

  useEffect(() => {
    dispatch(fetchTodayAttendance());
    dispatch(fetchMyHistory());
    dispatch(fetchMySummary());
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn());
    if (checkIn.fulfilled.match(result)) {
      setActionMessage({ type: 'success', text: 'Checked in successfully! Have a productive day.' });
      dispatch(fetchTodayAttendance());
    } else {
      setActionMessage({ type: 'error', text: result.payload as string });
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (checkOut.fulfilled.match(result)) {
      setActionMessage({ type: 'success', text: 'Checked out successfully! See you tomorrow.' });
      dispatch(fetchTodayAttendance());
    } else {
      setActionMessage({ type: 'error', text: result.payload as string });
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      present: 'badge badge-success',
      late: 'badge badge-warning',
      'half-day': 'badge badge-warning',
      absent: 'badge badge-danger',
    };
    return styles[status] || 'badge badge-neutral';
  };

  const recentAttendance = history.slice(0, 5);

  const statsCards = [
    {
      title: 'Present Days',
      value: summary?.present || 0,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Late Arrivals',
      value: summary?.late || 0,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Half Days',
      value: summary?.halfDay || 0,
      icon: Timer,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Hours',
      value: summary?.totalHours?.toFixed(1) || '0',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      suffix: 'hrs',
    },
  ];

  return (
    <div className="space-y-8 lg:space-y-10 animate-fadeIn pb-8">
      {/* Action Message */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-slideIn ${
            actionMessage.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
          <span className="font-medium">{actionMessage.text}</span>
        </div>
      )}

      {/* Hero Section - Check In/Out */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 text-white\" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 mb-3">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-5">
              {!hasCheckedIn ? 'Ready to start your day?' : 'Welcome back!'}
            </h1>
            <div className="flex items-center gap-4 text-indigo-100">
              <div className="text-5xl lg:text-6xl font-bold font-mono tracking-tight">
                {format(currentTime, 'HH:mm')}
              </div>
              <div className="text-2xl font-light text-indigo-300">
                {format(currentTime, 'ss')}
              </div>
            </div>
            
            {hasCheckedIn && todayAttendance?.checkInTime && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <Clock className="w-4 h-4" />
                  <span>In: {format(parseISO(todayAttendance.checkInTime), 'hh:mm a')}</span>
                </div>
                {todayAttendance.checkOutTime && (
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Clock className="w-4 h-4" />
                    <span>Out: {format(parseISO(todayAttendance.checkOutTime), 'hh:mm a')}</span>
                  </div>
                )}
                <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize border ${
                  todayAttendance.status === 'present' ? 'bg-emerald-400/20 border-emerald-400/30' :
                  todayAttendance.status === 'late' ? 'bg-amber-400/20 border-amber-400/30' :
                  'bg-white/10 border-white/20'
                }`}>
                  {todayAttendance.status}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            {!hasCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="group relative px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 flex items-center gap-3"
              >
                <Zap className="w-6 h-6" />
                Check In Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : !todayAttendance.checkOutTime ? (
              <button
                onClick={handleCheckOut}
                disabled={isLoading}
                className="group relative px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 flex items-center gap-3"
              >
                <XCircle className="w-6 h-6" />
                Check Out
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-emerald-400/50 text-white rounded-2xl font-bold text-lg flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-400" />
                Day Completed!
              </div>
            )}
            {hasCheckedIn && todayAttendance.totalHours && (
              <div className="text-center">
                <p className="text-indigo-200 text-sm">Total Hours</p>
                <p className="text-2xl font-bold">{todayAttendance.totalHours.toFixed(2)} hrs</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="card card-hover p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <Target className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {stat.value}
              {stat.suffix && <span className="text-lg text-gray-400 ml-1">{stat.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500 mt-1">Your attendance history</p>
          </div>
          <Link
            to="/employee/history"
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {recentAttendance.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentAttendance.map((record, index) => (
              <div
                key={record.id || index}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-400 font-medium">
                      {format(parseISO(record.date), 'MMM')}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {format(parseISO(record.date), 'd')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(parseISO(record.date), 'EEEE')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {record.checkInTime ? format(parseISO(record.checkInTime), 'hh:mm a') : '-'}
                      {record.checkOutTime && ` - ${format(parseISO(record.checkOutTime), 'hh:mm a')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {record.totalHours && (
                    <span className="text-sm text-gray-500 hidden sm:block">
                      {record.totalHours.toFixed(1)} hrs
                    </span>
                  )}
                  <span className={getStatusBadge(record.status)}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No attendance records yet</p>
            <p className="text-sm text-gray-400 mt-1">Start tracking by checking in today!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
