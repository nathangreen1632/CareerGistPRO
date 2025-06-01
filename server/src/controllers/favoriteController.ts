import { Response } from 'express';
import db from '../database/models/index.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { v4 as uuidv4 } from 'uuid';
import { logUserAnalytics } from '../helpers/logUserAnalytics.js';

export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  const {
    jobId,
    title,
    company,
    location,
    description,
    applyLink,
    summary,
    logoUrl,
    postedAt,
    salaryMin,
    salaryMax,
    salaryPeriod,
  } = req.body;

  if (
    !userId ||
    !jobId ||
    !title ||
    !company ||
    !location ||
    !description ||
    !applyLink ||
    !summary ||
    salaryMin == null ||
    salaryMax == null
  ) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    let job = await db.Job.findOne({ where: { sourceId: jobId } });

    job ??= await db.Job.create({
      id: uuidv4(),
      sourceId: jobId,
      title,
      company: company ?? 'Unknown Company',
      location: location ?? 'Unknown Location',
      description: '',
      url: applyLink,
      summary: summary ?? '',
      logoUrl: logoUrl ?? null,
      postedAt: postedAt ?? null,
      saved: true,
    });

    await db.Favorite.create({
      userId,
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description ?? '',
      url: job.url ?? '',
      summary: summary ?? '',
      logoUrl: job.logoUrl,
      postedAt: job.postedAt,
      salaryMin,
      salaryMax,
      salaryPeriod,
    });

    if (userId) {
      await logUserAnalytics({
        userId,
        action: 'favorite',
        jobId: job.id,
        title: job.title,
        company: job.company ?? 'Unknown Company',
        location: job.location ?? 'Unknown Location',
        description: job.description ?? '',
        salaryMin: typeof salaryMin === 'number' ? salaryMin : 0,
        salaryMax: typeof salaryMax === 'number' ? salaryMax : 0,
      });
    }
    res.status(201).json({ message: 'Job added to favorites.' });
  } catch (error: any) {
    console.error('❌ Error adding favorite:', error);
    res.status(500).json({ error: 'Server error adding favorite.' });
  }
};


export const getFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ error: 'Missing user ID.' });
    return;
  }

  try {
    const favorites = await db.Favorite.findAll({
      where: { userId },
      include: [{ model: db.Job }],
    });

    res.json(favorites);
  } catch (error: any) {
    console.error('❌ Error fetching favorites:', error);
    res.status(500).json({ error: 'Server error fetching favorites.' });
  }
};

export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { jobId } = req.params;

  if (!userId || !jobId) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    await db.Favorite.destroy({
      where: { userId, jobId }
    });

    await db.UserAnalytics.destroy({
      where: {
        userId,
        jobId,
        action: 'favorite'
      }
    });

    res.json({ message: 'Favorite removed and analytics updated.' });
  } catch (error) {
    console.error('❌ Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite.' });
  }
};

