"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BrowseHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BrowseHistory.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
      },
      queryId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "BrowseHistory",
    }
  );
  return BrowseHistory;
};