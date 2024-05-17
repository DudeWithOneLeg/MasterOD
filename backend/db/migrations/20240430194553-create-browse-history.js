'use strict';
/** @type {import('sequelize-cli').Migration} */
const options = {}
if (process.env.NODE_ENV === 'production') {
  options.process.env.SHEMA
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BrowseHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      queryId: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'BrowseHistories'
    await queryInterface.dropTable(options);
  }
};
