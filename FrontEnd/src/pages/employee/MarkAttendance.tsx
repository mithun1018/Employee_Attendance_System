import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchTodayAttendance,
  checkIn,
  checkOut,
} from '../../store/slices/attendanceSlice';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogIn,
  LogOut,
  Zap,
  Coffee,
  Calendar,
  Timer,
  Award,
  ArrowRight,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const MarkAttendance: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { todayAttendance, isLoading } = useAppSelector((state) => state.attendance);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    dispatch(fetchTodayAttendance());
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

  const hasCheckedIn = todayAttendance && todayAttendance.checkInTime;

  const getStatusInfo = () => {
    if (!hasCheckedIn) {
      return {
        status: 'Not Checked In',
        message: 'Ready to start your workday?',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        ringColor: 'ring-gray-200',
        icon: Coffee,
      };
    }
    if (todayAttendance?.checkOutTime) {
      return {
        status: 'Day Completed',
        message: 'Great job today!',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
        ringColor: 'ring-emerald-200',
        icon: Award,
      };
    }
    return {
      status: 'Currently Working',
      message: 'You are clocked in',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      ringColor: 'ring-indigo-200',
      icon: Zap,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-8 animate-fadeIn">
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

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 p-8 md:p-12 text-white text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-200 mb-4">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mark Attendance</h1>
          <p className="text-indigo-200 mb-8">Track your daily work hours</p>
          
          {/* Live Clock */}
          <div className="inline-flex items-center justify-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6">
            <div className="text-6xl md:text-7xl font-bold font-mono tracking-tight">
              {format(currentTime, 'HH:mm')}
            </div>
            <div className="text-3xl font-light text-indigo-300 ml-2">
              {format(currentTime, 'ss')}
            </div>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          {/* Current Status */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className={`w-20 h-20 ${statusInfo.bgColor} rounded-2xl flex items-center justify-center mb-4 ring-4 ${statusInfo.ringColor}`}>
              <statusInfo.icon className={`w-10 h-10 ${statusInfo.color}`} />
            </div>
            <p className={`text-2xl font-bold ${statusInfo.color}`}>{statusInfo.status}</p>
            <p className="text-gray-500 mt-1">{statusInfo.message}</p>
          </div>

          {/* Time Details */}
          {hasCheckedIn && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 text-center border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <LogIn className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Check In</p>
                <p className="text-xl font-bold text-gray-900">
                  {todayAttendance.checkInTime
                    ? format(parseISO(todayAttendance.checkInTime), 'hh:mm a')
                    : '-'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-5 text-center border border-rose-100">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <LogOut className="w-6 h-6 text-rose-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Check Out</p>
                <p className="text-xl font-bold text-gray-900">
                  {todayAttendance.checkOutTime
                    ? format(parseISO(todayAttendance.checkOutTime), 'hh:mm a')
                    : '-'}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!hasCheckedIn && (
              <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-6 h-6" />
                Check In Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {hasCheckedIn && !todayAttendance?.checkOutTime && (
              <button
                onClick={handleCheckOut}
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-rose-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-rose-600 hover:to-orange-700 transition-all shadow-lg shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-6 h-6" />
                Check Out
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {hasCheckedIn && todayAttendance?.checkOutTime && (
              <div className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 text-emerald-700 rounded-2xl font-bold text-lg">
                <Award className="w-6 h-6" />
                You have completed your day!
              </div>
            )}
          </div>

          {/* Total Hours */}
          {hasCheckedIn && todayAttendance?.totalHours && (
            <div className="mt-8 text-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                <Timer className="w-5 h-5" />
                <span className="text-sm font-medium">Total Hours Worked Today</span>
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {todayAttendance.totalHours.toFixed(2)} hrs
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Guidelines Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-3">Attendance Guidelines</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Check-in before 9:30 AM to be marked as "Present"
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Check-in after 9:30 AM will be marked as "Late"
              </li>
              <li className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-blue-500" />
                Remember to check out before leaving
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
