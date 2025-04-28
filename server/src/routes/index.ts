// src/routes/index.ts

import { Router } from 'express';
import authRoutes from './authRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import savedJobRoutes from './savedJobRoutes.js';
import summaryRoutes from './summaryRoutes.js';
import jobRoutes from './jobRoutes.js';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/summaries', summaryRoutes);
router.use('/jobs', jobRoutes);   // Most important for fetching jobs

export default router;
