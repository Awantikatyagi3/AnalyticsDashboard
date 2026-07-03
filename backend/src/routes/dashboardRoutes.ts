import { Router } from 'express';
import { DashboardController, dashboardIdSchema } from '../controllers/dashboardController';
import { validateRequest } from '../middlewares/validationMiddleware';

const router = Router();

/**
 * @openapi
 * /api/dashboards:
 *   get:
 *     summary: Retrieve all dashboards
 *     description: Returns a list of all dashboards available in the system
 *     tags:
 *       - Dashboards
 *     responses:
 *       200:
 *         description: A list of dashboards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   powerBiUrl:
 *                     type: string
 *                   lastUpdated:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/', DashboardController.getAllDashboards);

/**
 * @openapi
 * /api/dashboards/{id}:
 *   get:
 *     summary: Retrieve a dashboard by ID
 *     description: Returns details of a specific dashboard using its numeric ID
 *     tags:
 *       - Dashboards
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the dashboard to retrieve
 *     responses:
 *       200:
 *         description: Dashboard details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 category:
 *                   type: string
 *                 powerBiUrl:
 *                   type: string
 *                 lastUpdated:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid dashboard ID parameter format
 *       404:
 *         description: Dashboard not found
 *       500:
 *         description: Server error
 */
router.get('/:id', validateRequest({ params: dashboardIdSchema }), DashboardController.getDashboardById);

export default router;
