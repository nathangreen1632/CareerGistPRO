import express, { Router } from 'express';
import { getPaginatedJobs, getRecommendedJobs, getJobBySourceId } from '../controllers/jobController.js';
import {seedAllAdzunaJobs} from "../services/adzunaSeeder";


const router: Router = express.Router();

router.get('/', getPaginatedJobs);
router.get('/recommendations', getRecommendedJobs);
router.get('/:sourceId', getJobBySourceId); // ✅ for React route fetch
router.post('/seed-all', seedAllAdzunaJobs);


export default router;
