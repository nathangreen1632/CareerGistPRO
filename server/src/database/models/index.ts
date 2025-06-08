import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import { initSearchTermsModel, SearchTerms } from './SearchTerms.js';
import { initUserModel, User }           from './User.js';
import { initFavoriteModel, Favorite }   from './Favorites.js';
import { initJobModel, Job }             from './Job.js';
import {
  initUserAnalyticsModel,
  UserAnalytics,
  associateUserAnalyticsModel,
} from './UserAnalytics.js';

dotenv.config();

// guard at runtime, narrow the type for TS
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ Missing DATABASE_URL – shutting down.');
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
});

initUserModel(sequelize);
initFavoriteModel(sequelize);
initJobModel(sequelize);
initUserAnalyticsModel(sequelize);
initSearchTermsModel(sequelize);

Favorite.belongsTo(Job, { foreignKey: 'jobId', targetKey: 'id' });
Job.hasMany(Favorite,   { foreignKey: 'jobId', sourceKey: 'id' });

associateUserAnalyticsModel({ Job });

const db = {
  sequelize,
  User,
  Favorite,
  Job,
  UserAnalytics,
  SearchTerms,
};

export default db;
