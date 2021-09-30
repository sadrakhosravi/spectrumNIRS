'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Experiment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each Experiment can have multiple Patients
      Experiment.hasMany(models.Patient, {
        foreignKey: 'experiment_id',
      });
    }
  }
  Experiment.init(
    {
      experiment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      date: DataTypes.DATE,
      settings: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: 'Experiment',
    }
  );
  return Experiment;
};
