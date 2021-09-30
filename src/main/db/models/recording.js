'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recording extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Recordings belongs to Patient
      Recording.belongsTo(models.Patient, {
        foreignKey: 'patient_id',
      });
    }
  }
  Recording.init(
    {
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Recording',
    }
  );
  return Recording;
};
