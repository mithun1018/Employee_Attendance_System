import { Attendance, User } from '../../models';
import { Op } from 'sequelize';

export async function getAllAttendance(filters: any) {
  const where: any = {};
  const userWhere: any = {};
  const targetDate = filters.date || new Date().toISOString().split('T')[0];

  // Support both exact date and date range
  if (filters.startDate && filters.endDate) {
    where.date = {
      [Op.between]: [filters.startDate, filters.endDate],
    };
  } else if (filters.startDate) {
    where.date = {
      [Op.gte]: filters.startDate,
    };
  } else if (filters.endDate) {
    where.date = {
      [Op.lte]: filters.endDate,
    };
  } else if (filters.date) {
    where.date = filters.date;
  }
  
  if (filters.status && filters.status !== 'absent') {
    where.status = filters.status;
  }
  if (filters.userId) {
    where.userId = filters.userId;
  }

  // Department filter
  if (filters.department) {
    userWhere.department = filters.department;
  }

  // Get attendance records
  const attendanceRecords = await Attendance.findAll({
    where,
    include: [{
      model: User,
      attributes: ['id', 'name', 'email', 'employeeId', 'department'],
      where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
    }],
    order: [['date', 'DESC']],
  });

  // If filtering by a specific date (not a range), include absent employees
  if (filters.date && !filters.startDate && !filters.endDate) {
    // Get all employees (with optional department filter)
    const employeeWhere: any = { role: 'employee' };
    if (filters.department) {
      employeeWhere.department = filters.department;
    }
    const allEmployees = await User.findAll({
      where: employeeWhere,
      attributes: ['id', 'name', 'email', 'employeeId', 'department'],
    });

    // Find employees who have no record for this date
    const employeesWithRecords = new Set(attendanceRecords.map((r: any) => r.userId));
    
    const absentEmployees = allEmployees
      .filter((emp: any) => !employeesWithRecords.has(emp.id))
      .map((emp: any) => ({
        id: null,
        userId: emp.id,
        date: filters.date,
        checkInTime: null,
        checkOutTime: null,
        status: 'absent',
        totalHours: null,
        User: emp,
      }));

    // If filtering specifically for absent, return only absent employees
    if (filters.status === 'absent') {
      return absentEmployees;
    }

    // If filtering for any other status, return only attendanceRecords (which are already filtered by status)
    if (filters.status) {
      return attendanceRecords;
    }

    // Otherwise, combine both lists
    return [...attendanceRecords, ...absentEmployees];
  }

  return attendanceRecords;
}

export async function getEmployeeAttendance(userId: number) {
  return await Attendance.findAll({
    where: { userId },
    include: [{
      model: User,
      attributes: ['id', 'name', 'email', 'employeeId', 'department'],
    }],
    order: [['date', 'DESC']],
  });
}

export async function getDashboardStats() {
  const today = new Date().toISOString().split('T')[0];

  const totalEmployees = await User.count({ where: { role: 'employee' } });
  
  const todayAttendance = await Attendance.findAll({
    where: { date: today },
  });

  const presentCount = todayAttendance.filter((a: any) => a.getDataValue('status') === 'present').length;
  const lateCount = todayAttendance.filter((a: any) => a.getDataValue('status') === 'late').length;
  const halfDayCount = todayAttendance.filter((a: any) => a.getDataValue('status') === 'half-day').length;
  
  // Assuming anyone not in attendance table today is absent
  const markedCount = todayAttendance.length;
  const absentCount = totalEmployees - markedCount;

  return {
    totalEmployees,
    today: {
      present: presentCount,
      late: lateCount,
      halfDay: halfDayCount,
      absent: absentCount < 0 ? 0 : absentCount, // Safety check
    }
  };
}

export async function getTodayStatus() {
  const today = new Date().toISOString().split('T')[0];
  
  // Get all employees
  const employees = await User.findAll({
    where: { role: 'employee' },
    attributes: ['id', 'name', 'employeeId', 'department'],
  });

  // Get today's attendance
  const attendance = await Attendance.findAll({
    where: { date: today },
  });

  // Map attendance to employees
  const result = employees.map((emp: any) => {
    const record = attendance.find((a: any) => a.userId === emp.id);
    return {
      id: emp.id,
      name: emp.name,
      employeeId: emp.employeeId,
      department: emp.department,
      status: record ? record.getDataValue('status') : 'absent',
      checkInTime: record ? record.getDataValue('checkInTime') : null,
      checkOutTime: record ? record.getDataValue('checkOutTime') : null,
    };
  });

  return result;
}

export async function exportAttendanceCSV(filters: any) {
  const data = await getAllAttendance(filters);
  
  // Simple CSV generation
  const header = 'Employee ID,Name,Date,Status,Check In,Check Out,Total Hours\n';
  const rows = data.map((row: any) => {
    const user = row.User;
    const checkIn = row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : '-';
    const checkOut = row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString() : '-';
    
    return `${user.employeeId},"${user.name}",${row.date},${row.status},${checkIn},${checkOut},${row.totalHours || 0}`;
  }).join('\n');

  return header + rows;
}
