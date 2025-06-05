import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database/models/index.js';

import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import appliedRoutes from './routes/appliedRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
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


app.get('/share/:sourceId', async (req: Request, res: Response): Promise<void> => {
  const { sourceId } = req.params;

  try {
    const job = await db.Job.findOne({ where: { sourceId } });

    if (!job) {
      res.status(404).send('Job not found');
      return;
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${host}`;
    const jobUrl = `${baseUrl}/job/${sourceId}`;
    const ogImage = `${baseUrl}/og-default.jpg?v=2`;
    const description = job.summary ?? job.description?.slice(0, 200) ?? 'AI-enhanced job opportunity.';
    const title = `${job.title} at ${job.company}`;

    const userAgent = req.get('User-Agent') ?? '';
    const isBot = /facebookexternalhit|linkedinbot|twitterbot|slackbot|discordbot|embedly|quora|whatsapp/i.test(userAgent);

    if (isBot) {
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
            <title>${title}</title>
          </head>
          <body>
            Preview only.
          </body>
        </html>
      `;
      res.status(200).send(html);
    } else {
      res.redirect(302, jobUrl);
    }
  } catch (err: any) {
    console.error('❌ SSR job preview error:', err);
    res.status(500).send('Internal server error');
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const startServer = async (): Promise<void> => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: false });

    app.listen(PORT, () => {
      console.log(`-→ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error during server startup:', error);
    process.exit(1);
  }
};

await startServer();
