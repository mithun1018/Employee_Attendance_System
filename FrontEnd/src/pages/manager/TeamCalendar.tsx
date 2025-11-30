import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTodayStatus } from '../../store/slices/attendanceSlice';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  CalendarDays,
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2.5 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2.5 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
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
              className="p-2 border-b border-r border-gray-50 bg-gray-50/50 min-h-[110px]"
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
                className={`p-2 border-b border-r border-gray-50 cursor-pointer transition-all min-h-[110px] ${
                  isSelected 
                    ? 'bg-indigo-50 border-indigo-100' 
                    : weekend 
                      ? 'bg-gray-50/50' 
                      : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full mb-2 transition-colors ${
                      isToday
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                        : isSelected
                          ? 'bg-indigo-100 text-indigo-700'
                          : weekend
                            ? 'text-gray-400'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {isToday && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      <span className="text-[10px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md font-medium">
                        P: {todayStatus.filter((e) => e.status === 'present').length}
                      </span>
                      <span className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded-md font-medium">
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'late':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'half-day':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const isSelectedToday = selectedDate && isSameDay(selectedDate, new Date());

  const summaryStats = [
    {
      label: 'Present',
      value: todayStatus.filter((e) => e.status === 'present').length,
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Late',
      value: todayStatus.filter((e) => e.status === 'late').length,
      icon: Clock,
      bgColor: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      textColor: 'text-amber-600',
    },
    {
      label: 'Absent',
      value: todayStatus.filter((e) => e.status === 'absent').length,
      icon: XCircle,
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      label: 'Total',
      value: todayStatus.length,
      icon: Users,
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Calendar</h1>
        <p className="text-gray-500 mt-1">Overview of team attendance by date</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2">{renderCalendar()}</div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-fit">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h3>
                {selectedDate && (
                  <p className="text-sm text-gray-500">{format(selectedDate, 'EEEE')}</p>
                )}
              </div>
            </div>
          </div>

          {isSelectedToday ? (
            <div className="p-5">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {summaryStats.map((stat, index) => (
                  <div key={index} className={`${stat.bgColor} rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-4 h-4 ${stat.textColor}`} />
                      </div>
                    </div>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Employee List */}
              <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {todayStatus.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {emp.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">{emp.name}</span>
                        <span className="text-xs text-gray-500">{emp.department || 'No dept'}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${getStatusBadge(
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
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium">Select today's date</p>
              <p className="text-sm text-gray-500 mt-1">to view attendance details</p>
              <p className="text-xs text-indigo-600 mt-3 bg-indigo-50 rounded-lg py-2 px-4 inline-block">
                📅 Historical data coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCalendar;
