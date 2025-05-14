import express, { Router } from 'express';
import { getPaginatedJobs, getRecommendedJobs, getJobBySourceId, seedAllJobsController} from '../controllers/jobController.js';


const router: Router = express.Router();

router.get('/', getPaginatedJobs);
router.get('/recommendations', getRecommendedJobs);
router.get('/:sourceId', getJobBySourceId); // ✅ for React route fetch
router.post('/seed-all', seedAllJobsController);


export default router;
