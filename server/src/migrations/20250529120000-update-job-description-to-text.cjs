'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('Jobs', 'description', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('Jobs', 'description', {
            type: Sequelize.STRING(255),
            allowNull: true,
        });
    },
};
