// server/src/database/models/Job.ts

import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface JobAttributes {
  id: string;
  title: string;
  company?: string;
  location?: string;
  description: string;
  summary?: string;
  url?: string;
  saved: boolean;
}

type JobCreationAttributes = Optional<JobAttributes, 'id' | 'company' | 'location' | 'summary' | 'url' | 'saved'>;

export class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: string;
  public title!: string;
  public company?: string;
  public location?: string;
  public description!: string;
  public summary?: string;
  public url?: string;
  public saved!: boolean;

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
      title: { type: DataTypes.STRING, allowNull: false },
      company: { type: DataTypes.STRING, allowNull: true },
      location: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: false },
      summary: { type: DataTypes.TEXT, allowNull: true },
      url: { type: DataTypes.STRING, allowNull: true },
      saved: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Job',
      tableName: 'Jobs',
    }
  );
}
