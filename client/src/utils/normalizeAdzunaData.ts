// client/src/utils/normalizeAdzunaData.ts

import { UnifiedJob } from '../types/jobTypes';

export function normalizeAdzunaData(jobs: any[]): UnifiedJob[] {
  return jobs.map((job) => ({
    id: job.id ?? '',
    title: job.title ?? 'No title provided',
    company: job.company?.display_name ?? 'Unknown Company',
    location: job.location?.display_name ?? 'Unknown Location',
    description: job.description ?? 'No description provided',
    summary: '', // 🔹 Will be populated later via summarizeJob
    applyLink: job.redirect_url ?? '',
    createdAt: job.created ?? undefined,
    postedAt: job.created ?? undefined,
    isRemote: job.salary_is_predicted === '1' ? true : undefined, // Not exact, best-guess
    salaryMin: job.salary_min ?? undefined,
    salaryMax: job.salary_max ?? undefined,
    salaryPeriod: job.salary_period ?? undefined,
    benefits: job.category?.label ? [job.category.label] : undefined,
    logoUrl: undefined, // 🔹 Adzuna free API doesn't expose logos
  }));
}
