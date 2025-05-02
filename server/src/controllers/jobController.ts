import { Request, Response } from 'express';
import db from '../database/models/index.js';
import fetch from 'node-fetch';
import { getCache, setCache } from '../cache/redisCacheService.js';
import { logUserAnalytics } from '../helpers/logUserAnalytics.js';


const { Job, User } = db;

// server/src/controllers/jobController.ts

export const getPaginatedJobs = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const title = (req.query.title as string) || 'Full Stack Engineer';
  const location = (req.query.location as string) || 'United States';
  const radius = parseInt(req.query.radius as string) || 25;

  const cacheKey = `adzuna:jobs:${title}:${location}:${radius}:${page}`;

  try {
    // 1. Check Redis cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      res.json(cached); // ✅ No JSON.parse anymore
      return;
    }


    // 2. Fetch from Adzuna API
    const country = process.env.ADZUNA_COUNTRY ?? 'us';
    const appId = process.env.ADZUNA_APP_ID!;
    const appKey = process.env.ADZUNA_APP_KEY!;

    const encodedTitle = encodeURIComponent(title);
    const encodedLocation = encodeURIComponent(location);

    const response = await fetch(`https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&what=${encodedTitle}&where=${encodedLocation}&distance=${radius}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Adzuna API Error [${response.status}]:`, errorText);
      res.status(response.status).json({ error: `Failed to fetch jobs from Adzuna API. Status: ${response.status}` });
      return;
    }

    const data = await response.json() as { results?: any[]; count?: number };

    const result = {
      jobs: data.results ?? [],
      currentPage: page,
      totalPages: Math.ceil((data.count ?? 0) / 10), // Adzuna returns 10 jobs per page by default
    };

    await setCache(cacheKey, result, 60 * 20); // Cache for 20 minutes

    const salaryMin = req.query.salaryMin ? Number(req.query.salaryMin) : undefined;
    const salaryMax = req.query.salaryMax ? Number(req.query.salaryMax) : undefined;

    const userId = (req as any).user?.id;

    if (userId) {
      await logUserAnalytics({
        userId,
        action: 'search',
        query: title,
        location,
        ...(salaryMin !== undefined ? { salaryMin } : {}),
        ...(salaryMax !== undefined ? { salaryMax } : {}),
      });
    }

    res.json(result);

  } catch (err: any) {
    console.error('❌ Unexpected Server Error fetching jobs:', err);
    res.status(500).json({ error: 'Unexpected server error fetching jobs.' });
  }
};


// GET /jobs
export const getAllJobs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await Job.findAll({
      include: [{ model: User, as: 'user', attributes: ['username'] }],
    });
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /jobs/:id
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const job = await Job.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['username'] }],
    });
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /jobs/saved - Get saved jobs for the user
export const retrieveSavedJobs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const savedJobs = await Job.findAll({
      where: { saved: true },
      include: [{ model: User, as: 'user', attributes: ['username'] }],
    });
    res.json(savedJobs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /jobs - save a job to database
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const newJob = await Job.create({ ...req.body, saved: true });
    res.status(201).json(newJob);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /jobs/:id - Update a job by id
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (job) {
      await job.update(req.body);
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /jobs/:id
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const job = await Job.findByPk(id);
    if (job) {
      await job.destroy();
      res.json({ message: 'Job deleted' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
