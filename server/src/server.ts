// server/src/server.ts

import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import db from './database/models/index.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

// ✅ Manual fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());

// ✅ Serve static frontend assets
app.use(express.static(path.join(__dirname, '../../client/dist')));

// ✅ Public API routes (no authentication required)
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/summaries', summaryRoutes);

// ✅ Protected API routes (authentication required)
app.use('/api/favorites', authenticateToken, favoriteRoutes);


// ✅ Universal catch-all route for React Router
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const startServer = async (): Promise<void> => {
  try {
    await db.sequelize.authenticate();

    await db.sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`-→ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error during server startup:', error);
    process.exit(1);
  }
};

await startServer();
