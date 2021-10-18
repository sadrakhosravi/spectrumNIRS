'use strict';
const Sequelize = require('sequelize');
import sequelize from 'db/models/database';

const Recording = sequelize.define('recording', {
  value: Sequelize.DataTypes.STRING,
});

export default Recording;
