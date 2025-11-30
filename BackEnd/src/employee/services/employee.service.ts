import { Attendance, User } from '../../models';
import { Op } from 'sequelize';

export async function checkIn(userId: number) {
  const today = new Date().toISOString().split('T')[0];

  // Check if already checked in today
  const existing = await Attendance.findOne({
    where: { userId, date: today },
  });

  if (existing) {
    throw new Error('Already checked in for today');
  }

  const now = new Date();
  // Determine status based on time (e.g., late if after 9:30 AM)
  let status = 'present';
  const lateThreshold = new Date();
  lateThreshold.setHours(9, 30, 0, 0); // 9:30 AM

  if (now > lateThreshold) {
    status = 'late';
  }

  const attendance = await Attendance.create({
    userId,
    date: today,
    checkInTime: now,
    status,
  });

  return attendance;
}

export async function checkOut(userId: number) {
  const today = new Date().toISOString().split('T')[0];

  const attendance = await Attendance.findOne({
    where: { userId, date: today },
  });

  if (!attendance) {
    throw new Error('No check-in record found for today');
  }

  if (attendance.getDataValue('checkOutTime')) {
    throw new Error('Already checked out for today');
  }

  const now = new Date();
  const checkInTime = attendance.getDataValue('checkInTime');

  if (!checkInTime) {
    throw new Error('Check-in time not set for this attendance record');
  }
  
  // Calculate total hours
  const diffMs = now.getTime() - new Date(checkInTime as Date).getTime();
  const totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

  // Update status for half-day if hours < 4 (example rule)
  let status = attendance.getDataValue('status');
  if (totalHours < 4) {
    status = 'half-day';
  }

  await attendance.update({
    checkOutTime: now,
    totalHours,
    status,
  });

  return attendance;
}

export async function getMyHistory(userId: number) {
  return await Attendance.findAll({
    where: { userId },
    order: [['date', 'DESC']],
  });
}

export async function getMySummary(userId: number) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const attendances = await Attendance.findAll({
    where: {
      userId,
      date: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
  });

  const summary = {
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    totalHours: 0,
  };

  attendances.forEach((record: any) => {
    const status = record.status;
    if (status === 'present') summary.present++;
    else if (status === 'absent') summary.absent++;
    else if (status === 'late') summary.late++;
    else if (status === 'half-day') summary.halfDay++;

    if (record.totalHours) {
      summary.totalHours += record.totalHours;
    }
  });

  // Round total hours
  summary.totalHours = parseFloat(summary.totalHours.toFixed(2));

  return summary;
}

export async function getTodayStatus(userId: number) {
  const today = new Date().toISOString().split('T')[0];
  const attendance = await Attendance.findOne({
    where: { userId, date: today },
  });

  return attendance || { status: 'not-marked' };
}
