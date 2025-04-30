// .sequelizerc
import path from 'path';

export default {
  'config': path.resolve('src', 'config', 'database.cjs'), // notice `.cjs`
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeds'),
  'migrations-path': path.resolve('src', 'migrations'),
};
