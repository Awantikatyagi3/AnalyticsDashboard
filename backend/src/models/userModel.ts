import { getDb } from '../config/database';
import { User } from '../types';

export class UserModel {
  static async findByUsername(username: string): Promise<User | null> {
    const db = await getDb();
    const user = await db.get<User>('SELECT * FROM users WHERE username = ?', username);
    return user || null;
  }

  static async create(user: User): Promise<number> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      user.username,
      user.password
    );
    return result.lastID || 0;
  }
}
