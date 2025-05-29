'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('user_analytics', 'description', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('user_analytics', 'description');
    }
};
