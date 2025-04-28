import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface FavoriteAttributes {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  company?: string;
  location?: string;
  description: string;
  summary?: string;
  url: string;
}

type FavoriteCreationAttributes = Optional<FavoriteAttributes, 'id' | 'company' | 'location' | 'summary'>;

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
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'Favorites',
    }
  );
}
