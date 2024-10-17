'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResourceGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResourceGroup.init({
    name:{ type: DataTypes.STRING } ,
    description:{ type: DataTypes.TEXT } ,
    userId:{ type: DataTypes.INTEGER },
    isPrivate:{ type: DataTypes.BOOLEAN },
    shareUrl:{ type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'ResourceGroup',
  });
  return ResourceGroup;
};
