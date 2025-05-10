import {Request, Response} from "express";
import db from "../database/models";
import fetch from "node-fetch";

export const seedAllAdzunaJobs = async (_req: Request, res: Response): Promise<void> => {
  const title = 'Full Stack Engineer';
  const location = 'United States';
  const radius = 25;
  const country = process.env.ADZUNA_COUNTRY ?? 'us';
  const appId = process.env.ADZUNA_APP_ID!;
  const appKey = process.env.ADZUNA_APP_KEY!;

  const encodedTitle = encodeURIComponent(title);
  const encodedLocation = encodeURIComponent(location);

  const storeJobs = async (jobs: any[]) => {
    for (const job of jobs) {
      const exists = await db.Job.findOne({ where: { sourceId: job.id } });
      if (!exists) {
        await db.Job.create({
          sourceId: job.id,
          title: job.title,
          description: job.description ?? '',
          company: job.company?.display_name ?? '',
          location: job.location?.display_name ?? '',
          summary: job.description?.slice(0, 250) ?? '',
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

  for (let page = 1; page <= 1500; page++) {
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&what=${encodedTitle}&where=${encodedLocation}&distance=${radius}`;

    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') ?? '';

      if (!res.ok) {
        const text = await res.text();
        console.warn(`❌ Page ${page} failed [${res.status}]: ${text.slice(0, 120)}...`);
        if (res.status === 429) {
          console.warn('⏳ Rate limited — waiting 10 seconds...');
          await new Promise((r) => setTimeout(r, 10000));
        }
        continue;
      }

      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.warn(`❌ Page ${page} returned non-JSON:\n${text.slice(0, 120)}...`);
        continue;
      }

      const data = (await res.json()) as { results?: any[] };
      console.log(`📦 Page ${page}: ${data.results?.length ?? 0} jobs`);
      if (data.results?.length) {
        await storeJobs(data.results);
      }

      // polite pause between requests
      await new Promise((r) => setTimeout(r, 300)); // 300ms delay

    } catch (err) {
      console.error(`❌ Page ${page} failed with error:`, err);
    }
  }

  res.status(200).json({ message: '✅ Seeding complete' });
};

// curl -X POST http://localhost:3001/api/jobs/seed-all