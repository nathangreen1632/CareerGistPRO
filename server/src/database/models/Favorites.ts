import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface FavoriteAttributes {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  company?: string | undefined;
  location?: string | undefined;
  description: string;
  summary?: string | undefined;
  url: string;
  logoUrl?: string | undefined;       // ✅ NEW
  postedAt?: string | undefined;      // ✅ NEW
  salaryMin?: number | undefined;     // ✅ NEW
  salaryMax?: number | undefined;     // ✅ NEW
  salaryPeriod?: string | undefined;  // ✅ NEW
}

type FavoriteCreationAttributes = Optional<
  FavoriteAttributes,
  'id' | 'company' | 'location' | 'summary' | 'logoUrl' | 'postedAt' | 'salaryMin' | 'salaryMax' | 'salaryPeriod'
>;

export class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
  public id!: string;
  public userId!: string;
  public jobId!: string;
  public title!: string;
  public company?: string;
  public location?: string;
  public description!: string;
  public summary?: string;
  public url!: string;
  public logoUrl?: string;     // ✅ NEW
  public postedAt?: string;   // ✅ NEW
  public salaryMin?: number;  // ✅ NEW
  public salaryMax?: number;  // ✅ NEW
  public salaryPeriod?: string; // ✅ NEW

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initFavoriteModel(sequelize: Sequelize): void {
  Favorite.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      summary: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logoUrl: {
        type: DataTypes.TEXT,   // ✅ NEW
        allowNull: true,
      },
      postedAt: {
        type: DataTypes.STRING, // ✅ NEW
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
      salaryPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
      },

    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'Favorites',
    }
  );
}
