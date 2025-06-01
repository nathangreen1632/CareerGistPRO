'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // ✅ Explicitly cast jobId to UUID using USING clause
        await queryInterface.sequelize.query(`
            ALTER TABLE "user_analytics"
                ALTER COLUMN "jobId" TYPE UUID USING "jobId"::uuid;
        `);
    },

    down: async (queryInterface, Sequelize) => {
        // ⬅️ Optional rollback to VARCHAR(255)
        await queryInterface.changeColumn('user_analytics', 'jobId', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
