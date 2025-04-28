// server/src/database/models/SavedJobs.ts

import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { Job } from './Job.js'; // Import Job model

interface SavedJobAttributes {
  id: string;
  userId: string;
  jobId: string;
}

type SavedJobCreationAttributes = Optional<SavedJobAttributes, 'id'>;

export class SavedJob extends Model<SavedJobAttributes, SavedJobCreationAttributes> implements SavedJobAttributes {
  public id!: string;
  public userId!: string;
  public jobId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    SavedJob.belongsTo(Job, { foreignKey: 'jobId', targetKey: 'id' });
  }
}

export function initSavedJobModel(sequelize: Sequelize): void {
  SavedJob.init(
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
      jobId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SavedJob',
      tableName: 'SavedJobs',
    }
  );
}
