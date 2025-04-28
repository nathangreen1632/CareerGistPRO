// src/controllers/favoriteController.ts

import { Response } from 'express';
import db from '../database/models/index.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { jobId, title, company, location, description, url } = req.body;

  if (!userId || !jobId || !title || !description) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    await db.Favorite.create({
      userId,
      jobId,
      title,
      company: company ?? 'Unknown Company',  // Fallback if missing
      location: location ?? 'Remote',          // Fallback if missing
      description,
      url: url ?? '', // ✅ Save an empty string instead of null (so it won't crash)
    });

    res.status(201).json({ message: 'Job added to favorites.' });
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Error adding favorite.' });
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
    console.error(error);
    res.status(500).json({ error: 'Error fetching favorites.' });
  }
};

export const removeFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { jobId } = req.params;

  if (!userId || !jobId) {
    res.status(400).json({ error: 'Missing user ID or job ID.' });
    return;
  }

  try {
    await db.Favorite.destroy({
      where: { userId, jobId },
    });
    res.json({ message: 'Favorite removed.' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Error removing favorite.' });
  }
};
