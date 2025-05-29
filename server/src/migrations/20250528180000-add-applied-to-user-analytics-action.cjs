'use strict';

/**
 * Adds the 'applied' value to the enum_user_analytics_action type
 */
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum_user_analytics_action'
          AND e.enumlabel = 'applied'
        ) THEN
          ALTER TYPE "enum_user_analytics_action" ADD VALUE 'applied';
        END IF;
      END $$;
    `);
    },

    down: async () => {
        console.warn('⚠️ Down migration skipped: Postgres does not support removing enum values');
        return Promise.resolve();
    }
};
