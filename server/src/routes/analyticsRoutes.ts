import express, { Router } from 'express';
import { getUserAnalyticsProfile, logSearchHistory } from '../controllers/analyticsController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router: Router = express.Router();

router.get('/profile', authenticateToken, getUserAnalyticsProfile);
router.post('/search-history', optionalAuth, logSearchHistory); // ✅ This allows guest access

export default router;
