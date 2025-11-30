import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/routes/auth.routes';
import employeeRoutes from './employee/routes/employee.routes';
import { sequelize } from './models';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', employeeRoutes);

app.get('/', (_req: Request, res: Response) => res.send('Employee Attendance Backend is running'));

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function start() {
  app.listen(PORT, async () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
    try {
      await sequelize.authenticate();
      // Sync models to DB (create tables if not exist)
      await sequelize.sync(); 
      console.log('Database connected!');
    } catch (error: any) {
      console.error('Unable to connect to the database:', error.message ?? error);
    }
  });
}

start();

export default app;
