import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/userModel';
import { generateToken } from '../utils/jwt';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await UserModel.findByUsername(username);
      if (!user || !user.password) {
        return res.status(401).json({ error: 'Invalid username or password' });
  }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = generateToken({ id: user.id, username: user.username });

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'An unexpected error occurred during login' });
    }
  }
}
