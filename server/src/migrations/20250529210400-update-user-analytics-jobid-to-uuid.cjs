'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('user_analytics', 'jobId', {
            type: Sequelize.UUID,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('user_analytics', 'jobId', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
