"use strict";
/** @type {import('sequelize-cli').Migration} */
const options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Users", "googleHashedPassword", {
            type: Sequelize.STRING.BINARY,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Users";
        await queryInterface.removeColumn(options, "googleHashedPassword");
    },
};
