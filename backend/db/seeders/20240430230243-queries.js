'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'Queries'
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const validQueries = [
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },{
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'bing',
        userId: 1,
        saved: false
      },
      {
        query: 'intitle:"index of /"',
        string:'test',
        engine: 'google',
        userId: 1,
        saved: true
      },

    ]
    await queryInterface.bulkInsert(options, validQueries, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
    }, {});

  }
};
