'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Result.init({
    title: {
      type: DataTypes.STRING
    },
    snippet: {
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    },
    queryId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    saved: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};
