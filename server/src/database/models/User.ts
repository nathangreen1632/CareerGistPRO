// server/src/database/models/User.ts

import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location?: string;
  passwordHash: string;
  role: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'location' | 'role'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public location?: string;
  public passwordHash!: string;
  public role!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initUserModel(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      location: { type: DataTypes.STRING, allowNull: true },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: 'free' },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
    }
  );
}
