import { Router } from 'express';
import { AuthController, loginSchema } from '../controllers/authController';
import { validateRequest } from '../middlewares/validationMiddleware';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in an administrative user
 *     description: Authenticates the admin user and returns a JSON Web Token (JWT)
 *     tags:
 *       - Authentication
 *       - Dashboards
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       400:
 *         description: Validation failed for login parameters
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */
router.post('/login', validateRequest({ body: loginSchema }), AuthController.login);

export default router;
