'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Files.hasMany(models.Domains, {
        foreignKey: 'file_domain_id'
      })
    }
  }
  Files.init({
    file_name: {
      type: DataTypes.STRING
    },
    file_size: {
      type: DataTypes.STRING
    },
    file_domain_id: {
      type: DataTypes.INTEGER
    },
    url: {
      type: DataTypes.STRING
    },
    dir_id: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Files',
  });
  return Files;
};
