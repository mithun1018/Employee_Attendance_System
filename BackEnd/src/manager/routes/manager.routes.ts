import { Router } from 'express';
import * as managerController from '../controllers/manager.controller';
import authMiddleware from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';

const router = Router();

// All routes require authentication and 'manager' role
router.use(authMiddleware);
router.use(requireRole('manager'));

router.get('/attendance', managerController.getAllAttendance);
router.get('/attendance/export', managerController.exportAttendance);
router.get('/attendance/:userId', managerController.getEmployeeAttendance);
router.get('/dashboard', managerController.getDashboardStats);
router.get('/today-status', managerController.getTodayStatus);

export default router;
