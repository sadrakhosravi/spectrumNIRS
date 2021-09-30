'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Patient belongs to Experiment
      Patient.belongsTo(models.Experiment, {
        foreignKey: 'experiment_id',
      });

      // Each Patient can have multiple Recordings
      Patient.hasMany(models.Recording, {
        foreignKey: 'patient_id',
      });
    }
  }
  Patient.init(
    {
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      dob: DataTypes.DATE,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Patient',
    }
  );
  return Patient;
};
