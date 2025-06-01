import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {getAppliedJobs, trackJobApplication, removeAppliedJob} from '../controllers/appliedController.js';

const router: Router = Router();

router.get('/', authenticateToken, getAppliedJobs);
router.post('/track', authenticateToken, trackJobApplication);
router.delete('/:jobId', authenticateToken, removeAppliedJob);

export default router;