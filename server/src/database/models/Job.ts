import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface JobAttributes {
  id: string;
  sourceId?: string;
  title: string;
  company?: string;
  location?: string;
  description: string;
  summary?: string;
  url?: string;
  logoUrl?: string;
  postedAt?: string;
  saved: boolean;

  // ✅ New fields required for recommendation rendering
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string;
  benefits?: string[];
}

type JobCreationAttributes = Optional<
  JobAttributes,
  | 'id'
  | 'sourceId'
  | 'company'
  | 'location'
  | 'summary'
  | 'url'
  | 'logoUrl'
  | 'postedAt'
  | 'salaryMin'
  | 'salaryMax'
  | 'salaryPeriod'
  | 'benefits'
  | 'saved'
>;

export class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: string;
  public sourceId?: string;
  public title!: string;
  public company?: string;
  public location?: string;
  public description!: string;
  public summary?: string;
  public url?: string;
  public logoUrl?: string;
  public postedAt?: string;
  public saved!: boolean;

  public salaryMin?: number;
  public salaryMax?: number;
  public salaryPeriod?: string;
  public benefits?: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initJobModel(sequelize: Sequelize): void {
  Job.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sourceId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logoUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      postedAt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      saved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // ✅ New fields
      salaryMin: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      salaryMax: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      salaryPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      benefits: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Job',
      tableName: 'Jobs',
    }
  );
}
