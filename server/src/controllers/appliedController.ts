import { Response } from 'express';
import db from '../database/models/index.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getAppliedJobs = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ error: 'Missing user ID.' });
    return;
  }

  try {
    const appliedJobs = await db.UserAnalytics.findAll({
      where: { userId, action: 'applied' },
      include: [{ model: db.Job, required: true }],
      order: [['timestamp', 'DESC']],
    });

    res.json(appliedJobs);
  } catch (error: any) {
    console.error('❌ Error fetching applied jobs:', error);
    res.status(500).json({ error: 'Failed to fetch applied jobs.' });
  }
};

export const trackJobApplication = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  const {
    jobId: sourceJobId,
    title,
    company,
    location,
    salaryMin,
    salaryMax,
    applyLink,
    summary,
    description,
    postedAt,
    logoUrl,
    salaryPeriod,
  } = req.body;

  if (
    !userId ||
    !sourceJobId ||
    !title ||
    !company ||
    !location ||
    salaryMin == null ||
    salaryMax == null ||
    !applyLink ||
    !summary ||
    !description
  ) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    const [job, created] = await db.Job.findOrCreate({
      where: { sourceId: sourceJobId },
      defaults: {
        sourceId: sourceJobId,
        title,
        company,
        location,
        url: applyLink ?? '',
        salaryMin: typeof salaryMin === 'number' ? salaryMin : 0,
        salaryMax: typeof salaryMax === 'number' ? salaryMax : 0,
        description: description ?? '',
        summary: summary ?? '',
        postedAt: postedAt ?? new Date().toISOString(),
        salaryPeriod: salaryPeriod ?? 'unknown',
        logoUrl: logoUrl ?? null,
      },
    });

    if (!created) {
      await job.update({
        title,
        company,
        location,
        url: applyLink ?? '',
        salaryMin: typeof salaryMin === 'number' ? salaryMin : 0,
        salaryMax: typeof salaryMax === 'number' ? salaryMax : 0,
        description: description ?? '',
        summary: summary ?? '',
        postedAt: postedAt ?? new Date().toISOString(),
        salaryPeriod: salaryPeriod ?? 'unknown',
        logoUrl: logoUrl ?? null,
      });
    }

    await db.UserAnalytics.create({
      userId,
      action: 'applied',
      jobId: job.id,
      title,
      company,
      location,
      description: description ?? '',
      summary: summary ?? '',
      salaryMin: typeof salaryMin === 'number' ? salaryMin : 0,
      salaryMax: typeof salaryMax === 'number' ? salaryMax : 0,
      applyLink: applyLink ?? '',
    });

    res.status(201).json({ message: 'Application logged and job persisted.' });
  } catch (err) {
    console.error('❌ Error logging application:', err);
    res.status(500).json({ error: 'Failed to log application.' });
  }
};

export const removeAppliedJob = async (
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
    await db.UserAnalytics.destroy({
      where: {
        userId,
        jobId,
        action: 'applied',
      },
    });

    res.json({ message: 'Applied job removed from analytics.' });
  } catch (error) {
    console.error('❌ Error removing applied job:', error);
    res.status(500).json({ error: 'Failed to remove applied job.' });
  }
};
