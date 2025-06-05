import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Define the shape of a row in the table
export interface SearchTermsAttributes {
  id: string;
  userId: string;   // camelCase to match your ERD!
  query: string;
  created_at?: Date;
  updated_at?: Date;
}

// Define fields required to create a new row (id and timestamps are optional)
export interface SearchTermsCreationAttributes extends Optional<SearchTermsAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class SearchTerms extends Model<SearchTermsAttributes, SearchTermsCreationAttributes>
  implements SearchTermsAttributes {
  public id!: string;
  public userId!: string;
  public query!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export function initSearchTermsModel(sequelize: Sequelize): void {
  SearchTerms.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {                 // <-- camelCase property
        type: DataTypes.UUID,
        allowNull: false,
        field: 'userId',        // <-- actual DB column name
      },
      query: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'SearchTerms',
      timestamps: true,
      underscored: true, // this maps createdAt/updatedAt → created_at/updated_at
    }
  );
}
