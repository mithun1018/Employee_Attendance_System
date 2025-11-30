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
      setActionMessage({ type: 'success', text: 'Checked in successfully!' });
      dispatch(fetchTodayAttendance());
    } else {
      setActionMessage({ type: 'error', text: result.payload as string });
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (checkOut.fulfilled.match(result)) {
      setActionMessage({ type: 'success', text: 'Checked out successfully!' });
      dispatch(fetchTodayAttendance());
    } else {
      setActionMessage({ type: 'error', text: result.payload as string });
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  const hasCheckedIn = todayAttendance && todayAttendance.checkInTime;

  const getStatusInfo = () => {
    if (!hasCheckedIn) {
      return {
        status: 'Not Checked In',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: Clock,
      };
    }
    if (todayAttendance?.checkOutTime) {
      return {
        status: 'Day Completed',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: CheckCircle,
      };
    }
    return {
      status: 'Checked In',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      icon: LogIn,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-500 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            actionMessage.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Current Time */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
          <p className="text-indigo-100 mb-2">Current Time</p>
          <p className="text-5xl font-bold font-mono">
            {format(currentTime, 'HH:mm:ss')}
          </p>
        </div>

        {/* Status Section */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`w-12 h-12 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
              <statusInfo.icon className={`w-6 h-6 ${statusInfo.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <p className={`text-xl font-semibold ${statusInfo.color}`}>{statusInfo.status}</p>
            </div>
          </div>

          {/* Time Details */}
          {hasCheckedIn && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Check In Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {todayAttendance.checkInTime
                    ? format(parseISO(todayAttendance.checkInTime), 'hh:mm a')
                    : '-'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Check Out Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {todayAttendance.checkOutTime
                    ? format(parseISO(todayAttendance.checkOutTime), 'hh:mm a')
                    : '-'}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!hasCheckedIn && (
              <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-6 h-6" />
                Check In
              </button>
            )}

            {hasCheckedIn && !todayAttendance?.checkOutTime && (
              <button
                onClick={handleCheckOut}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-6 h-6" />
                Check Out
              </button>
            )}

            {hasCheckedIn && todayAttendance?.checkOutTime && (
              <div className="w-full flex items-center justify-center gap-3 py-4 bg-gray-100 text-gray-600 rounded-xl font-semibold text-lg">
                <CheckCircle className="w-6 h-6" />
                You have completed your day!
              </div>
            )}
          </div>

          {/* Total Hours */}
          {hasCheckedIn && todayAttendance?.totalHours && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Total Hours Worked Today</p>
              <p className="text-3xl font-bold text-indigo-600">
                {todayAttendance.totalHours.toFixed(2)} hrs
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Attendance Guidelines</p>
            <ul className="list-disc list-inside space-y-1 text-blue-600">
              <li>Check-in before 9:30 AM to be marked as "Present"</li>
              <li>Check-in after 9:30 AM will be marked as "Late"</li>
              <li>Remember to check out before leaving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
