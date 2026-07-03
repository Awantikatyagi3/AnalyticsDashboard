import { Router } from 'express';
import { AnalyticsController, categorySchema } from '../controllers/analyticsController';
import { validateRequest } from '../middlewares/validationMiddleware';

const router = Router();

/**
 * @openapi
 * /api/analytics/{category}:
 *   get:
 *     summary: Retrieve analytics metrics by category
 *     description: Returns key-value metrics for a specified category (census, tourism, health, education, finance, ev)
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [census, tourism, health, education, finance, ev]
 *         description: Category of analytics to fetch
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   category:
 *                     type: string
 *                   metricName:
 *                     type: string
 *                   metricValue:
 *                     type: number
 *       400:
 *         description: Invalid category parameter
 *       500:
 *         description: Server error
 */
router.get('/:category', validateRequest({ params: categorySchema }), AnalyticsController.getAnalyticsByCategory);

export default router;
