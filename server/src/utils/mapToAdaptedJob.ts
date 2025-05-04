// server/src/utils/mapToAdaptedJob.ts

import { Job } from '../database/models/Job.js';

export const mapToAdaptedJob = (job: Job) => {
  return {
    id: job.id,
    title: job.title ?? 'No title provided',
    company: job.company ?? 'Unknown Company',
    location: job.location ?? 'Unknown Location',
    description: job.description ?? 'No description provided',
    summary: job.summary ?? '',
    applyLink: job.url ?? '',
    createdAt: job.createdAt ?? undefined,
    postedAt: job.postedAt ?? undefined,
    isRemote: job.location?.toLowerCase().includes('remote') ?? false,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryPeriod: job.salaryPeriod ?? undefined,
    logoUrl: job.logoUrl ?? undefined,
  };
};
