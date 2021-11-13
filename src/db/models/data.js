'use strict';
const Sequelize = require('sequelize');
import sequelize from 'db/models/database';

const Data = sequelize.define(
  'data',
  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    values: Sequelize.DataTypes.TEXT,
  },
  {
    timestamps: false,
  }
);

export default Data;
