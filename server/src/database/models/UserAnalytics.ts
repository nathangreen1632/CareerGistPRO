import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface UserAnalyticsAttributes {
  id: string;
  userId: string;
  action: 'search' | 'favorite';
  query?: string;
  jobId?: string;
  title?: string;
  location?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  timestamp?: Date;
  applyLink?: string;
}

type UserAnalyticsCreationAttributes = Optional<UserAnalyticsAttributes, 'id' | 'query' | 'jobId' | 'title' | 'location' | 'company' | 'salaryMin' | 'salaryMax' | 'timestamp' | 'applyLink'>;

export class UserAnalytics extends Model<UserAnalyticsAttributes, UserAnalyticsCreationAttributes>
  implements UserAnalyticsAttributes {
  public id!: string;
  public userId!: string;
  public action!: 'search' | 'favorite';
  public query?: string;
  public jobId?: string;
  public title?: string;
  public location?: string;
  public company?: string;
  public salaryMin?: number;
  public salaryMax?: number;
  public timestamp?: Date;
  public applyLink?: string;
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
        type: DataTypes.ENUM('search', 'favorite'),
        allowNull: false,
      },
      query: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jobId: {
        type: DataTypes.STRING,
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
