"use strict";
/** @type {import('sequelize-cli').Migration} */
const {User} = require('../models')
const options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.addColumn("Users", "email", {
        //     type: Sequelize.STRING(256),
        //     allowNull: true
        // });
        await queryInterface.addColumn("Users", "isOauth", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Users";
        await queryInterface.removeColumn(options, "email");

        await queryInterface.removeColumn(options, "isOauth");
    },
};
