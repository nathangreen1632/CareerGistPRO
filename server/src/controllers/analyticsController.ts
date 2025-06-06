import { Response } from 'express';
import db from '../database/models/index.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { Op, fn, col, literal } from 'sequelize';

export const getUserAnalyticsProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required.' });
    return;
  }

  try {
    const salaryHistoryRaw = await db.UserAnalytics.findAll({
      where: {
        userId,
        action: 'favorite',
        salaryMin: { [Op.not]: 0 },
        salaryMax: { [Op.not]: 0 },
      },
      attributes: [
        'title',
        'jobId',
        'company',
        'location',
        'applyLink',
        [fn('DATE_TRUNC', 'month', col('timestamp')), 'date'],
        [fn('AVG', literal('("salaryMin" + "salaryMax") / 2')), 'avgSalary'],
      ],
      group: ['title', 'jobId', 'company', 'location', 'applyLink', 'date'],
      order: [[literal('date'), 'ASC']],
      raw: true,
    });

    const companyFavorites = await db.UserAnalytics.findAll({
      where: { userId, action: 'favorite' },
      attributes: ['company', [fn('COUNT', col('company')), 'count']],
      group: ['company'],
      order: [[fn('COUNT', col('company')), 'DESC']],
      raw: true,
    });

    const locationSpreadRaw = await db.UserAnalytics.findAll({
      where: {
        userId,
        action: 'favorite',
        location: {
          [Op.ne]: '',
        },
      },
      attributes: [
        [fn('TRIM', fn('SPLIT_PART', col('location'), ',', 1)), 'region'],
        [fn('COUNT', col('location')), 'count'],
      ],
      group: ['region'],
      order: [[literal('count'), 'DESC']],
      raw: true,
    });

    const locationSpread = locationSpreadRaw.map((row: any) => ({
      location: row.region.trim(),
      count: Number(row.count),
    }));


    res.json({ salaryHistory: salaryHistoryRaw, companyFavorites, locationSpread });
  } catch (error: any) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
};

export const logSearchHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { query } = req.body;

  if (!userId || !query || typeof query !== "string") {
    res.status(204).end();
    return;
  }

  try {
    await db.SearchTerms.create({
      userId,
      query,
    });

    res.status(201).json({ message: 'Search term logged.' });
    return;
  } catch (error: any) {
    console.error('❌ Failed to log search term:', error);
    res.status(500).json({ error: 'Failed to log search term.' });
    return;
  }
};
