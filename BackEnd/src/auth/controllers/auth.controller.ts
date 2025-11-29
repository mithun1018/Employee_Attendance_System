import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role, department, employeeId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password are required' });

    const { user, token } = await registerUser({ name, email, password, role, department, employeeId });

    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, employeeId: user.employeeId, department: user.department }, token });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

    const { user, token } = await loginUser({ email, password });

    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, employeeId: user.employeeId, department: user.department }, token });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Login failed' });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const anyReq: any = req;
    if (!anyReq.user) return res.status(401).json({ message: 'Unauthorized' });
    const u = anyReq.user;
    return res.json({ id: u.id, name: u.name, email: u.email, role: u.role, employeeId: u.employeeId, department: u.department, createdAt: u.createdAt });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
}

export default { register, login, me };
