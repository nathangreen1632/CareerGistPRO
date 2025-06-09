import { Request, Response } from 'express';
import db from '../database/models/index.js';
import fetch from 'node-fetch';
import { getCache, setCache } from '../cache/redisCacheService.js';
import { logUserAnalytics } from '../helpers/logUserAnalytics.js';
import { recommendJobs } from '../helpers/recommendJobs.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { seedAllAdzunaJobs } from '../services/adzunaSeeder.js';

export const getPaginatedJobs = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const title = (req.query.title as string) || 'Full Stack Engineer';
  const location = (req.query.location as string) || 'United States';
  const radius = parseInt(req.query.radius as string) || 25;
  const cacheKey = `adzuna:jobs:${title}:${location}:${radius}:${page}`;
  const userId = (req as any).user?.id;

  const country = process.env.ADZUNA_COUNTRY ?? 'us';
  const appId = process.env.ADZUNA_APP_ID!;
  const appKey = process.env.ADZUNA_APP_KEY!;

  const encodedTitle = encodeURIComponent(title);
  const encodedLocation = encodeURIComponent(location);
  const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&what=${encodedTitle}&where=${encodedLocation}&distance=${radius}`;

  const buildResponse = (data: any) => ({
    jobs: data.results ?? [],
    currentPage: page,
    totalPages: Math.ceil((data.count ?? 0) / 10),
  });

  const persistJobs = async (jobs: any[]) => {
    for (const job of jobs) {
      const sourceId = job.id?.toString() ?? '';
      const exists = await db.Job.findOne({ where: { sourceId } });

      if (!exists) {
        await db.Job.create({
          sourceId,
          title: job.title,
          description: job.description ?? '',
          company: job.company?.display_name ?? '',
          location: job.location?.display_name ?? '',
          summary: '',
          url: job.redirect_url ?? '',
          logoUrl: job.company?.logo ?? '',
          postedAt: job.created ?? null,
          saved: false,
          salaryMin: job.salary_min ?? null,
          salaryMax: job.salary_max ?? null,
          salaryPeriod: job.salary_is_predicted === '1' ? 'predicted' : 'actual',
          benefits: job.category?.tag ? [job.category.tag] : [],
        });
      }
    }
  };

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const response = await fetch(adzunaUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Adzuna API Error [${response.status}]:`, errorText);
      res.status(response.status).json({ error: `Failed to fetch jobs from Adzuna API.` });
      return;
    }

    const data = await response.json() as { results?: any[]; count?: number };

    if (data.results?.length) {
      await persistJobs(data.results);
    }

    const result = buildResponse(data);
    await setCache(cacheKey, result, 60 * 20);

    const salaryMin = req.query.salaryMin ? Number(req.query.salaryMin) : undefined;
    const salaryMax = req.query.salaryMax ? Number(req.query.salaryMax) : undefined;

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

export const getRecommendedJobs = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const newJobs = await db.Job.findAll({
      where: { saved: false },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const recommendations = await recommendJobs(userId, newJobs);

    res.json(recommendations);
  } catch (err) {
    console.error('❌ Failed to fetch recommended jobs:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

export const getJobBySourceId = async (req: Request, res: Response): Promise<void> => {
  const { sourceId } = req.params;

  try {
    const job = await db.Job.findOne({
      where: { sourceId: sourceId.toString() },
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    res.status(200).json(job);
  } catch (err) {
    console.error('❌ Failed to fetch job by sourceId:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const seedAllJobsController = async (_req: Request, res: Response): Promise<void> => {
  await seedAllAdzunaJobs(_req, res);
  res.status(200).json({ message: '✅ Seeding complete' });
};
