import { Request, Response } from 'express';
import { z } from 'zod';
import { AnalyticsModel } from '../models/analyticsModel';

export const categorySchema = z.object({
  category: z.enum(['census', 'tourism', 'health', 'education', 'finance', 'ev'], {
    errorMap: () => ({
      message: 'Category must be one of the following: census, tourism, health, education, finance, ev'
    })
  })
});

export class AnalyticsController {
  static async getAnalyticsByCategory(req: Request, res: Response) {
    try {
      const category = req.params.category;
      const data = await AnalyticsModel.findByCategory(category);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return res.status(500).json({ error: 'Failed to retrieve analytics data' });
    }
  }
}
