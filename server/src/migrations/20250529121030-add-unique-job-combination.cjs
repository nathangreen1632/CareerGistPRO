'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DELETE FROM "Jobs"
            WHERE id IN (
                SELECT id
                FROM (
                         SELECT id,
                                ROW_NUMBER() OVER (
                                    PARTITION BY "sourceId"
                                    ORDER BY "createdAt" ASC
                                    ) AS row_num
                         FROM "Jobs"
                     ) duplicates
                WHERE duplicates.row_num > 1
            );
        `);

        await queryInterface.sequelize.query(`
      ALTER TABLE "Jobs" DROP CONSTRAINT IF EXISTS unique_title_location_summary;
    `);

        await queryInterface.addConstraint('Jobs', {
            fields: ['sourceId'],
            type: 'unique',
            name: 'unique_sourceId',
        });
    },

    async down(queryInterface, Sequelize) {

        await queryInterface.removeConstraint('Jobs', 'unique_sourceId');

        await queryInterface.addConstraint('Jobs', {
            fields: ['title', 'location', 'summary'],
            type: 'unique',
            name: 'unique_title_location_summary',
        });
    },
};
