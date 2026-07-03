import { getDb } from '../config/database';
import { Analytics } from '../types';

export class AnalyticsModel {
  static async findByCategory(category: string): Promise<Analytics[]> {
    const db = await getDb();
    const metrics = await db.all<Analytics[]>(
      'SELECT * FROM analytics WHERE category = ?',
      category.toLowerCase()
    );
    return metrics;
  }
}
