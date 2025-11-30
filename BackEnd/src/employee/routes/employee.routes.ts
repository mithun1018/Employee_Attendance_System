import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/checkin', employeeController.checkIn);
router.post('/checkout', employeeController.checkOut);
router.get('/my-history', employeeController.getHistory);
router.get('/my-summary', employeeController.getSummary);
router.get('/today', employeeController.getToday);

export default router;
