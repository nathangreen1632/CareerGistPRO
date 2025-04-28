// src/controllers/savedJobController.ts

import { Response } from 'express';
import db from '../database/models/index.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const addSavedJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { jobId } = req.body;

  if (!userId || !jobId) {
    res.status(400).json({ error: 'Missing user ID or job ID.' });
    return;
  }

  try {
    await db.SavedJob.create({ userId, jobId });
    res.status(201).json({ message: 'Job saved for later.' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Error saving job.' });
  }
};

export const getSavedJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ error: 'Missing user ID.' });
    return;
  }

  try {
    const savedJobs = await db.SavedJob.findAll({
      where: { userId },
      include: [{ model: db.Job }],
    });

    res.json(savedJobs);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching saved jobs.' });
  }
};

export const removeSavedJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { jobId } = req.params;

  if (!userId || !jobId) {
    res.status(400).json({ error: 'Missing user ID or job ID.' });
    return;
  }

  try {
    await db.SavedJob.destroy({
      where: { userId, jobId },
    });
    res.json({ message: 'Saved job removed.' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Error removing saved job.' });
  }
};
