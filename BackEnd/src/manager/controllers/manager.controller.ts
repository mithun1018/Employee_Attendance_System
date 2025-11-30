import { Request, Response } from 'express';
import * as managerService from '../services/manager.service';

export async function getAllAttendance(req: Request, res: Response) {
  try {
    const filters = {
      date: req.query.date,
      status: req.query.status,
      userId: req.query.userId,
    };
    const data = await managerService.getAllAttendance(filters);
    res.json(data);
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getEmployeeAttendance(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const data = await managerService.getEmployeeAttendance(userId);
    res.json(data);
  } catch (error) {
    console.error('Get employee attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const stats = await managerService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getTodayStatus(req: Request, res: Response) {
  try {
    const data = await managerService.getTodayStatus();
    res.json(data);
  } catch (error) {
    console.error('Get today status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function exportAttendance(req: Request, res: Response) {
  try {
    const filters = {
      date: req.query.date,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      status: req.query.status,
      userId: req.query.userId,
    };
    const csv = await managerService.exportAttendanceCSV(filters);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
