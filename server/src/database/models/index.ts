import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import { initUserModel, User } from './User.js';
import { initFavoriteModel, Favorite } from './Favorites.js';
import { initJobModel, Job } from './Job.js';
import { initUserAnalyticsModel, UserAnalytics } from './UserAnalytics.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: false,
});

// Initialize all models
initUserModel(sequelize);
initFavoriteModel(sequelize);
initJobModel(sequelize);
initUserAnalyticsModel(sequelize);

// 🛠 Setup associations AFTER models initialized
Favorite.belongsTo(Job, { foreignKey: 'jobId', targetKey: 'id' });
Job.hasMany(Favorite, { foreignKey: 'jobId', sourceKey: 'id' });

const db = {
  sequelize,
  User,
  Favorite,
  Job,
  UserAnalytics,
};

export default db;
