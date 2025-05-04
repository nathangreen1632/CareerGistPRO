import express, { Router } from 'express';
import { getPaginatedJobs, getRecommendedJobs } from '../controllers/jobController.js';


const router: Router = express.Router();

router.get('/', getPaginatedJobs);
router.get('/recommendations', getRecommendedJobs);


export default router;
