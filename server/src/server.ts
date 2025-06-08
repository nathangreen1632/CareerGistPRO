import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error('❌ Missing BASE_URL in .env');
  process.exit(1);
}

const app: Application = express();

app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT ?? 3001;

app.use(express.json());

app.get('/og-default.jpg', (_req, res) => {
  res.setHeader('Content-Type', 'image/jpeg');
  res.sendFile(path.join(__dirname, '../../client/public/og-default.jpg'));
});

app.use(express.static(path.join(__dirname, '../../client/public')));
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/applied', authenticateToken, appliedRoutes);
app.use('/api/favorites', authenticateToken, favoriteRoutes);
app.use('/api/interview', authenticateToken, interviewRoutes);
app.use('/api/recommendations', authenticateToken, recommendationRoutes);

app.get(
  '/share/:sourceId',
  asyncHandler(async (req: Request, res: Response) => {
    const { sourceId } = req.params;
    const job = await db.Job.findOne({ where: { sourceId } });
    if (!job) {
      res.status(404).send('Job not found');
      return;
    }

    const safeId      = encodeURIComponent(sourceId);
    const jobUrl      = `${BASE_URL}/job/${safeId}`;
    const ogImage     = `${BASE_URL}/og-default.jpg?v=2`;
    const title       = `${job.title} at ${job.company}`;
    const description =
      job.summary
      ?? job.description?.slice(0, 200)
      ?? 'AI-enhanced job opportunity.';

    try {
      // DEBUG: show where Express is looking for views, and what files exist
      console.log('🔍 Views directory:', path.join(__dirname, 'views'));
      console.log('🔍 Available view files:', fs.readdirSync(path.join(__dirname, 'views')));

      res
        .status(200)
        .render('share', {
          jobUrl,
          ogImage,
          title,
          description,
          clientRedirect: jobUrl,
        });
      return;
    } catch (err: any) {
      console.error('❌ Error in share.render:', err.stack ?? err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
  })
);

app.get('*', (_req, res): void => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

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
