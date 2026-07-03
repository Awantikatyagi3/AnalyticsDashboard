import { Router } from 'express';
import { InsightController, insightBodySchema } from '../controllers/insightController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validationMiddleware';

const router = Router();

/**
 * @openapi
 * /api/insights:
 *   post:
 *     summary: Generate an AI-style insight summary for a category
 *     description: Analyzes database metrics for a category and returns an AI-styled synthesis of takeaways and action items. Requires a valid JWT token.
 *     tags:
 *       - Insights
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [census, tourism, health, education, finance, ev]
 *                 example: ev
 *     responses:
 *       200:
 *         description: Insight summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 keyTakeaways:
 *                   type: array
 *                   items:
 *                     type: string
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *                 analyzedBy:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation failed (missing or invalid category)
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       404:
 *         description: Analytics data not found for category
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, validateRequest({ body: insightBodySchema }), InsightController.generateInsight);

export default router;
