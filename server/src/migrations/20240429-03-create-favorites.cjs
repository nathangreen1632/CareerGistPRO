'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Favorites', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      jobId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Jobs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        allowNull: false,
      },
      logoUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      postedAt: {
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
      salaryPeriod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Favorites');
  },
};
