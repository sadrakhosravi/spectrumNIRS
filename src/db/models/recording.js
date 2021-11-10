'use strict';
const Sequelize = require('sequelize');
import sequelize from 'db/models/database';

const Recording = sequelize.define('recording', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: Sequelize.DataTypes.STRING,
  description: Sequelize.DataTypes.STRING,
  date: Sequelize.DataTypes.DATE,
  settings: Sequelize.DataTypes.JSON,
});

export default Recording;
