// server/src/controllers/recommendationController.ts

import { Request, Response } from 'express';
import db from '../database/models/index.js';
import { recommendJobs } from '../helpers/recommendJobs.js';

export const getRecommendedJobs = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const recentJobs = await db.Job.findAll({
      where: { saved: false },
      limit: 100,
      order: [['createdAt', 'DESC']],
    });

    const recommendations = (await recommendJobs(userId, recentJobs)).slice(0, 10);

    res.json(recommendations);
  } catch (error) {
    console.error('❌ Failed to fetch recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommended jobs' });
  }
};
