'use strict';
const Sequelize = require('sequelize');
import sequelize from 'db/models/database';

const Patient = sequelize.define('patient', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: Sequelize.DataTypes.STRING,
  dob: Sequelize.DataTypes.DATEONLY,
  description: Sequelize.DataTypes.TEXT,
});

export default Patient;
