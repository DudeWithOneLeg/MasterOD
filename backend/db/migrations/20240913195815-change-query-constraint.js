'use strict';

/** @type {import('sequelize-cli').Migration} */
const options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Queries', 'query', {
      type: Sequelize.STRING(3500) // or true, depending on what you want
    });
    await queryInterface.changeColumn('Queries', 'string', {
      type: Sequelize.STRING(3500) // or true, depending on what you want
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Queries";
    await queryInterface.changeColumn(options, 'query', {
      type: Sequelize.STRING // revert to the original state
    });
    await queryInterface.changeColumn(options, 'string', {
      type: Sequelize.STRING // revert to the original state
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
