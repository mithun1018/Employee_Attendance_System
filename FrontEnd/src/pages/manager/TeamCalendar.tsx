import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTodayStatus } from '../../store/slices/attendanceSlice';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isWeekend,
} from 'date-fns';

const TeamCalendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todayStatus, isLoading } = useAppSelector((state) => state.attendance);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    dispatch(fetchTodayStatus());
  }, [dispatch]);

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-medium text-gray-500 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before month start */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="p-3 border-b border-r border-gray-100 bg-gray-50 min-h-[100px]"
            />
          ))}

          {/* Days */}
          {days.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const weekend = isWeekend(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 border-b border-r border-gray-100 cursor-pointer transition-colors min-h-[100px] ${
                  isSelected ? 'bg-indigo-50' : weekend ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : weekend
                        ? 'text-gray-400'
                        : 'text-gray-900'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {isToday && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                        P: {todayStatus.filter((e) => e.status === 'present').length}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                        A: {todayStatus.filter((e) => e.status === 'absent').length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700';
      case 'late':
        return 'bg-yellow-100 text-yellow-700';
      case 'half-day':
        return 'bg-orange-100 text-orange-700';
      case 'absent':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const isSelectedToday = selectedDate && isSameDay(selectedDate, new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Calendar</h1>
        <p className="text-gray-500 mt-1">Overview of team attendance</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2">{renderCalendar()}</div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
          </div>

          {isSelectedToday ? (
            <div className="p-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {todayStatus.filter((e) => e.status === 'present').length}
                  </p>
                  <p className="text-xs text-green-700">Present</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {todayStatus.filter((e) => e.status === 'late').length}
                  </p>
                  <p className="text-xs text-yellow-700">Late</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {todayStatus.filter((e) => e.status === 'absent').length}
                  </p>
                  <p className="text-xs text-red-700">Absent</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-indigo-600">{todayStatus.length}</p>
                  <p className="text-xs text-indigo-700">Total</p>
                </div>
              </div>

              {/* Employee List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {todayStatus.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {emp.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(
                        emp.status
                      )}`}
                    >
                      {emp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select today's date to view attendance details</p>
              <p className="text-sm mt-1">Historical data coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCalendar;
