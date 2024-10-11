'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupResources extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupResources.init({
    groupId: { type: DataTypes.INTEGER},
    resourceId: { type: DataTypes.INTEGER},
    userId: { type: DataTypes.INTEGER}
  }, {
    sequelize,
    modelName: 'GroupResources',
  });
  return GroupResources;
};
