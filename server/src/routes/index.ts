// src/routes/index.ts

import { Router } from 'express';
import authRoutes from './authRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import summaryRoutes from './summaryRoutes.js';
import jobRoutes from './jobRoutes.js';
import analyticsRoutes from "./analyticsRoutes";

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/summaries', summaryRoutes);
router.use('/jobs', jobRoutes);
router.use('/analytics', analyticsRoutes)

export default router;
