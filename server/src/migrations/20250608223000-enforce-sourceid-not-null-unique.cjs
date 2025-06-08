'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Enforce NOT NULL on sourceId
        await queryInterface.changeColumn('Jobs', 'sourceId', {
            type: Sequelize.STRING,
            allowNull: false,
        });

        // 2. Add UNIQUE constraint to sourceId
        await queryInterface.addConstraint('Jobs', {
            fields: ['sourceId'],
            type: 'unique',
            name: 'unique_sourceId_constraint', // Explicit name to ease reversion
        });
    },

    down: async (queryInterface, Sequelize) => {
        // 1. Remove UNIQUE constraint
        await queryInterface.removeConstraint('Jobs', 'unique_sourceId_constraint');

        // 2. Allow sourceId to be nullable again
        await queryInterface.changeColumn('Jobs', 'sourceId', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
