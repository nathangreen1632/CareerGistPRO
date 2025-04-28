import { Router } from 'express';
import { summarizeJobDescription } from '../controllers/summaryController.js';

const router: Router = Router();

router.post('/summarize', summarizeJobDescription);

export default router;
