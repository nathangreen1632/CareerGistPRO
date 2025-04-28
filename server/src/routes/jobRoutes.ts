import express, { Router } from 'express';
import { getPaginatedJobs } from '../controllers/jobController.js';

const router: Router = express.Router();

// Fetch paginated jobs from JSearch
router.get('/', getPaginatedJobs);

export default router;
