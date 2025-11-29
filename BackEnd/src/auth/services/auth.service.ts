import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models';

function generateEmployeeId() {
  const suffix = Date.now().toString().slice(-6);
  return `EMP${suffix}`;
}

export async function registerUser({ name, email, password, role = 'employee', department, employeeId }:
  { name: string; email: string; password: string; role?: string; department?: string; employeeId?: string }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(password, 10);
  const empId = employeeId || generateEmployeeId();

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    department,
    employeeId: empId,
  });

  const userData: any = user.toJSON ? user.toJSON() : (user as any);

  const token = jwt.sign({ id: userData.id, role: userData.role }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });

  return { user: userData, token };
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const userData: any = user.toJSON ? user.toJSON() : (user as any);

  const match = await bcrypt.compare(password, userData.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: userData.id, role: userData.role }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });

  return { user: userData, token };
}

export default { registerUser, loginUser };
