'use strict';
const Sequelize = require('sequelize');
import sequelize from 'db/models/database';

const Data = sequelize.define(
  'data',
  {
    values: Sequelize.DataTypes.TEXT,
    hypoxia: Sequelize.DataTypes.BOOLEAN,
    event2: Sequelize.DataTypes.BOOLEAN,
  },
  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
  }
);

export default Data;
