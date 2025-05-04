'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await Promise.all([
      queryInterface.addColumn('Jobs', 'salaryMin', {
        type: DataTypes.FLOAT,
        allowNull: true,
      }),
      queryInterface.addColumn('Jobs', 'salaryMax', {
        type: DataTypes.FLOAT,
        allowNull: true,
      }),
      queryInterface.addColumn('Jobs', 'salaryPeriod', {
        type: DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Jobs', 'benefits', {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.removeColumn('Jobs', 'salaryMin'),
      queryInterface.removeColumn('Jobs', 'salaryMax'),
      queryInterface.removeColumn('Jobs', 'salaryPeriod'),
      queryInterface.removeColumn('Jobs', 'benefits'),
    ]);
  },
};
