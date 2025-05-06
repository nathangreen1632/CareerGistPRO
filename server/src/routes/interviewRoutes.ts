import express, {Router} from 'express';
import { getInterviewQuestions } from '../controllers/interviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router: Router = express.Router();

router.post('/questions', authenticateToken, getInterviewQuestions);

export default router;
