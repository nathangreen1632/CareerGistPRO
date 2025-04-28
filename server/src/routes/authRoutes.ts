import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getMe);

export default router;
