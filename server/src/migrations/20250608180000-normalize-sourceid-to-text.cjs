'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Ensure sourceId is stored as TEXT for LinkedIn/Open Graph compatibility
        await queryInterface.sequelize.query(`
      UPDATE "Jobs"
      SET "sourceId" = CAST("sourceId" AS TEXT)
      WHERE "sourceId" IS NOT NULL;
    `);
    },

    down: async (_queryInterface, _Sequelize) => {
        // Reverting from TEXT to original unknown type isn't possible safely
        console.warn('⚠️ Down migration for sourceId normalization is a no-op. Manual intervention required to restore original type.');
    },
};
