import { Request, Response } from 'express';
import db from '../database/models/index.js';
import fetch from 'node-fetch';
import { getCache, setCache } from '../cache/redisCacheService.js';

const { Job, User } = db;

// GET /jobs?page=1
// GET /jobs?page=1
export const getPaginatedJobs = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const query = 'software engineer'; // Default query for now

  const cacheKey = `jobs:${query}:${page}`;

  try {
    // 1. Check Redis cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log('📦 Serving jobs from cache:', cacheKey);
      const parsedCache = typeof cached === 'string' ? JSON.parse(cached) : cached;
      res.json(parsedCache);
      return;
    }

    // 2. Fetch from JSearch API
    const response = await fetch(`${process.env.JSEARCH_API_URL}?query=${encodeURIComponent(query)}&page=${page}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST!,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ JSearch API Error [${response.status}]:`, errorText);
      res.status(response.status).json({ error: `Failed to fetch jobs from JSearch API. Status: ${response.status}` });
      return;
    }

    const data = await response.json() as { data?: any[]; total_pages?: number };

    console.log('🌍 Raw JSearch API Payload:\n', JSON.stringify(data, null, 2)); // ✅ Pretty-printed full payload

    const result = {
      jobs: data.data ?? [],
      currentPage: page,
      totalPages: data.total_pages ?? 10,
    };

    await setCache(cacheKey, result, 60 * 20); // Cache for 20 minutes

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
