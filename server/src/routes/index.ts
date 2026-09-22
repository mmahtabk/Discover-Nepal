import { Router } from 'express';
import provinceRoutes from './province.routes.js';
import destinationRoutes from './destination.routes.js';
import authRoutes from './auth.routes.js';
import tripRoutes from './trip.routes.js';
import userRoutes from './user.routes.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json(ApiResponse.ok({ status: 'ok', uptime: process.uptime() }));
});

router.use('/provinces', provinceRoutes);
router.use('/destinations', destinationRoutes);
router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/users', userRoutes);

export default router;