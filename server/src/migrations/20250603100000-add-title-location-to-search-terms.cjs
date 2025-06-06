'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SearchTerms', 'title', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('SearchTerms', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SearchTerms', 'title');
    await queryInterface.removeColumn('SearchTerms', 'location');
  },
};
