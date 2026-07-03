import { Router } from 'express';
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';
import analyticsRoutes from './analyticsRoutes';
import insightRoutes from './insightRoutes';

const router = Router();

// Aggregate sub-routers
router.use('/auth', authRoutes);
router.use('/dashboards', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/insights', insightRoutes);

export default router;
