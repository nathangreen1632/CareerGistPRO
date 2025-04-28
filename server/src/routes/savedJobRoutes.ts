import { Router } from 'express';
import { addSavedJob, getSavedJobs, removeSavedJob } from '../controllers/savedJobController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.post('/', authenticateToken, addSavedJob);
router.get('/', authenticateToken, getSavedJobs);
router.delete('/:jobId', authenticateToken, removeSavedJob);

export default router;
