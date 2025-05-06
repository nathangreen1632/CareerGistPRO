import { Router } from 'express';
import { registerUser, loginUser, getMe, refreshToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getMe);
router.post('/refresh-token', refreshToken); // ✅ NEW route

export default router;
