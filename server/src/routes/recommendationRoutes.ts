import express, {Router} from 'express';
import { getRecommendedJobs } from '../controllers/recommendationController.js';


const router: Router = express.Router();

router.get('/', getRecommendedJobs);

export default router;
