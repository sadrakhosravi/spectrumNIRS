'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/dbconfig.js')[env];

console.log(config);

export const sequelize = new Sequelize(config);

export default sequelize;
