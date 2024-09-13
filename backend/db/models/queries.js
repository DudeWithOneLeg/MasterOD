"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Queries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Queries.init(
    {
      query: {
        type: DataTypes.STRING(3500),
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      engine: {
        type: DataTypes.STRING,
      },
      saved: {
        type: DataTypes.BOOLEAN,
      },
      string: {
        type: DataTypes.STRING(3500),
      },
    },
    {
      sequelize,
      modelName: "Queries",
    }
  );
  return Queries;
};
