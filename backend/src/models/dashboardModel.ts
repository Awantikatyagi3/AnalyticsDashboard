import { getDb } from '../config/database';
import { Dashboard } from '../types';

export class DashboardModel {
  static async findAll(): Promise<Dashboard[]> {
    const db = await getDb();
    const dashboards = await db.all<Dashboard[]>('SELECT * FROM dashboards');
    return dashboards;
  }

  static async findById(id: number): Promise<Dashboard | null> {
    const db = await getDb();
    const dashboard = await db.get<Dashboard>('SELECT * FROM dashboards WHERE id = ?', id);
    return dashboard || null;
  }
}
