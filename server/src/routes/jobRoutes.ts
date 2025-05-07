import express, { Router } from 'express';
import { getPaginatedJobs, getRecommendedJobs, getJobBySourceId } from '../controllers/jobController.js';
// import { renderJobSharePage } from '../ssr/jobShareRenderer.js';

const router: Router = express.Router();

router.get('/', getPaginatedJobs);
router.get('/recommendations', getRecommendedJobs);
router.get('/:sourceId', getJobBySourceId); // ✅ for React route fetch
// router.get('/share/:sourceId', renderJobSharePage); // SSR preview

export default router;
