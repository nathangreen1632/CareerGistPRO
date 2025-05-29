import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface UserAnalyticsAttributes {
  id: string;
  userId: string;
  action: 'search' | 'favorite' | 'applied';
  query?: string;
  description?: string;
  jobId?: string;
  title?: string;
  location?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  timestamp?: Date;
  applyLink?: string;
  summary?: string; // Added summary field
}

type UserAnalyticsCreationAttributes = Optional<UserAnalyticsAttributes, 'id' | 'query' | 'description' | 'jobId' | 'title' | 'location' | 'company' | 'salaryMin' | 'salaryMax' | 'timestamp' | 'applyLink'>;

export class UserAnalytics extends Model<UserAnalyticsAttributes, UserAnalyticsCreationAttributes>
  implements UserAnalyticsAttributes {
  public id!: string;
  public userId!: string;
  public action!: 'search' | 'favorite' | 'applied';
  public query?: string;
  public description?: string;
  public jobId?: string;
  public title?: string;
  public location?: string;
  public company?: string;
  public salaryMin?: number;
  public salaryMax?: number;
  public timestamp?: Date;
  public applyLink?: string;
  public summary?: string;
}

export function initUserAnalyticsModel(sequelize: Sequelize): void {
  UserAnalytics.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM('search', 'favorite', 'applied'),
        allowNull: false,
      },
      query: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      jobId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salaryMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salaryMax: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      applyLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserAnalytics',
      tableName: 'user_analytics',
      timestamps: false,
    }
  );
}

export function associateUserAnalyticsModel(models: any): void {
  UserAnalytics.belongsTo(models.Job, {
    foreignKey: 'jobId',
    as: 'Job',
  });
}