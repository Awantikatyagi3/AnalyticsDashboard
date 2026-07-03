import { Request, Response } from 'express';
import { z } from 'zod';
import { DashboardModel } from '../models/dashboardModel';

export const dashboardIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a numeric integer').transform(Number)
});

export class DashboardController {
  static async getAllDashboards(req: Request, res: Response) {
    try {
      const dashboards = await DashboardModel.findAll();
      return res.status(200).json(dashboards);
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      return res.status(500).json({ error: 'Failed to retrieve dashboards' });
    }
  }

  static async getDashboardById(req: Request, res: Response) {
    try {
      // id is parsed and transformed to a number by the validation middleware
      const id = req.params.id as unknown as number;

      const dashboard = await DashboardModel.findById(id);
      if (!dashboard) {
        return res.status(404).json({ error: `Dashboard with ID ${id} not found` });
      }

      return res.status(200).json(dashboard);
    } catch (error) {
      console.error('Error fetching dashboard by ID:', error);
      return res.status(500).json({ error: 'Failed to retrieve dashboard details' });
    }
  }
}
