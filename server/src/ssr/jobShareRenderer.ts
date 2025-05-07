// server/src/ssr/jobShareRenderer.ts
import { Request, Response } from 'express';
import db from '../database/models/index.js';


export const renderJobSharePage = async (req: Request, res: Response): Promise<void> => {
  const { sourceId } = req.params;

  try {
    const job = await db.Job.findOne({ where: { sourceId } });

    if (!job) {
      res.status(404).send('<h1>Job not found</h1>');
      return;
    }

    const ogTitle = `${job.title} at ${job.company}`;
    const ogDescription = job.summary ?? job.description?.slice(0, 250) ?? 'Job opportunity on CareerGistPRO';
    const ogImage = 'https://www.careergistpro.com/og-default.jpg';
    const ogUrl = `https://www.careergistpro.com/job/${sourceId}`;

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="${ogTitle}" />
        <meta property="og:description" content="${ogDescription}" />
        <meta property="og:image" content="${ogImage}" />
        <meta property="og:url" content="${ogUrl}" />
        <meta property="og:type" content="website" />
        <title>${ogTitle}</title>
      </head>
      <body>
        <p>Redirecting to <a href="${ogUrl}">${ogUrl}</a>...</p>
        <script>window.location.href = "${ogUrl}"</script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('❌ SSR error rendering job share page:', error);
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
};
