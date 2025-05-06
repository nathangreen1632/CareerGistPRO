import express, {Router} from 'express';
import { getUserAnalyticsProfile } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router: Router = express.Router();

router.get('/profile', authenticateToken, getUserAnalyticsProfile);

export default router;
