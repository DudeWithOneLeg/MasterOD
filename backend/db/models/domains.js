'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Domains extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Domains.hasMany(models.Files, {
        foreignKey: 'file_domain_id'
      })
    }
  }
  Domains.init({
    domain: {
      type: DataTypes.STRING
    },
    num_files: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Domains',
  });
  return Domains;
};
