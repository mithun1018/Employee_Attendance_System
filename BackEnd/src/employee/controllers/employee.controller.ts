import { Request, Response } from 'express';
import * as employeeService from '../services/employee.service';

interface AuthRequest extends Request {
  user?: any;
}

export async function checkIn(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const result = await employeeService.checkIn(userId);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function checkOut(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const result = await employeeService.checkOut(userId);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function getHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const history = await employeeService.getMyHistory(userId);
    return res.json(history);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getSummary(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const summary = await employeeService.getMySummary(userId);
    return res.json(summary);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getToday(req: AuthRequest, res: Response) {
  try {
    const userId = req.user.id;
    const status = await employeeService.getTodayStatus(userId);
    return res.json(status);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}
