import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.post('/', authenticateToken, addFavorite);
router.get('/', authenticateToken, getFavorites);
router.delete('/:jobId', authenticateToken, removeFavorite);

export default router;
