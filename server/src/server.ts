import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from 'express-async-handler';
import db from './database/models/index.js';

import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import appliedRoutes from './routes/appliedRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

// 🔐 Escape HTML to prevent XSS
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error('❌ Missing BASE_URL in .env');
  process.exit(1);
}

const app: Application = express();
app.disable('x-powered-by');

const PORT = process.env.PORT ?? 3001;
app.use(express.json());

// Serve Open Graph fallback image
app.get('/og-default.jpg', (_req, res) => {
  res.setHeader('Content-Type', 'image/jpeg');
  res.sendFile(path.join(__dirname, '../../client/public/og-default.jpg'));
});

// Serve static assets
app.use(express.static(path.join(__dirname, '../../client/public')));
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/applied', authenticateToken, appliedRoutes);
app.use('/api/favorites', authenticateToken, favoriteRoutes);
app.use('/api/interview', authenticateToken, interviewRoutes);
app.use('/api/recommendations', authenticateToken, recommendationRoutes);

// 🔁 SSR endpoint for Open Graph bots
app.get(
  '/share/:sourceId',
  asyncHandler(async (req: Request, res: Response) => {
    const { sourceId } = req.params;
    const job = await db.Job.findOne({ where: { sourceId } }); // ✅ FIXED

    if (!job) {
      res.status(404).send('Job not found');
      return;
    }

    const jobUrl = `${BASE_URL}/job/${encodeURIComponent(sourceId)}`;
    const ogImage = `${BASE_URL}/og-default.jpg?v=2`;

    const rawTitle = `${job.title} at ${job.company}`;
    const rawDesc =
      job.summary ??
      job.description?.slice(0, 200) ??
      'AI-enhanced job opportunity.';

    const cleanDesc = rawDesc.replace(/\s+/g, ' ').trim(); // ✅ strip newlines
    const title = escapeHtml(rawTitle);
    const description = escapeHtml(cleanDesc); // ✅ SAFE for <meta>

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${jobUrl}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${ogImage}" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${ogImage}" />

        <meta http-equiv="refresh" content="0;url=${jobUrl}" />
        <title>${title}</title>
      </head>
      <body>
        <p>Redirecting… If you're not forwarded, <a href="${jobUrl}">click here</a>.</p>
      </body>
      </html>
    `;

    res.status(200).type('html').send(html);
  })
);

// 🎯 Client-side routing fallback
app.get('*', (_req, res): void => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// 🚀 Start server
const startServer = async (): Promise<void> => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: false });
    app.listen(PORT, () => {
      console.log(`→ Server running at ${BASE_URL} (port ${PORT})`);
    });
  } catch (error) {
    console.error('❌ Error during server startup:', error);
    process.exit(1);
  }
};

await startServer();
