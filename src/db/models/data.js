'use strict';
const Sequelize = require('sequelize');
import sequelize from 'db/models/database';

const Data = sequelize.define('data', {
  timeStamp: {
    type: Sequelize.DataTypes.FLOAT(undefined, 2),
  },
  calcValues: {
    type: Sequelize.DataTypes.STRING,
  },
  rawValues: {
    type: Sequelize.DataTypes.STRING,
  },
  intensities: {
    type: Sequelize.DataTypes.STRING,
  },
});

export default Data;
