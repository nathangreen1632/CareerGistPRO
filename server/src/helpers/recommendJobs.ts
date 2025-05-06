// server/src/helpers/recommendJobs.ts

import db from '../database/models/index.js';
import { Job } from '../database/models/Job.js';
import { getKeywordsFromText } from '../utils/textAnalysis.js';
import { levenshteinDistance } from '../utils/levenshtein.js';

interface ScoredJob {
  job: any;
  score: number;
}

const mapToUnifiedJob = (job: Job): Record<string, any> => ({
  id: job.id,
  title: job.title,
  company: job.company,
  location: job.location,
  description: job.description,
  summary: job.summary ?? '',
  applyLink: job.url,
  postedAt: job.postedAt,
  logoUrl: job.logoUrl ?? undefined,
  salaryMin: job.salaryMin ?? null,
  salaryMax: job.salaryMax ?? null,
  salaryPeriod: job.salaryPeriod ?? null,
  benefits: job.benefits ?? [],
});

export const recommendJobs = async (userId: string, newJobs: Job[]): Promise<ScoredJob[]> => {
  try {
    const favorites = await db.Favorite.findAll({ where: { userId } });
    if (favorites.length === 0) {
      return newJobs.slice(0, 10).map(job => ({
        job: mapToUnifiedJob(job),
        score: 0,
      }));
    }

    const titleCorpus = favorites.map(f => f.title.toLowerCase());
    const regionCorpus = favorites
      .map(f => f.location?.split(',')[0].trim().toLowerCase())
      .filter(Boolean);
    const keywordCorpus = favorites.flatMap(fav =>
      getKeywordsFromText(fav.description + ' ' + (fav.summary ?? ''))
    );
    const uniqueKeywords = [...new Set(keywordCorpus)];

    const scored = newJobs.map(job => {
      let score = 0;

      const titleScore = titleCorpus.reduce((max, favTitle) => {
        const dist = levenshteinDistance(favTitle, job.title.toLowerCase());
        const similarity = 1 - dist / Math.max(favTitle.length, job.title.length);
        return Math.max(max, similarity);
      }, 0);
      score += titleScore * 30;

      const jobRegion = job.location?.split(',')[0].trim().toLowerCase();
      if (regionCorpus.includes(jobRegion)) score += 10;

      const jobKeywords = getKeywordsFromText(job.description + ' ' + (job.summary ?? ''));
      const overlap = jobKeywords.filter(k => uniqueKeywords.includes(k)).length;
      const keywordScore = Math.min((overlap / uniqueKeywords.length) * 60, 60);
      score += keywordScore;

      return { job: mapToUnifiedJob(job), score: Math.round(score) };
    });

    return scored
      .slice()
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  } catch (err) {
    console.error('❌ Error in recommendJobs:', err);
    return newJobs.slice(0, 10).map(job => ({
      job: mapToUnifiedJob(job),
      score: 0,
    }));
  }
};
