const { app } = require('electron');
const { databasePath } = require('@electron/paths');
const path = require('path');

const appDataDir = path.join(databasePath, 'main.db');

module.exports = {
  development: {
    storage: appDataDir,
    dialect: 'sqlite',
    logging: false,
  },
  test: {
    storage: appDataDir,
    dialect: 'sqlite',
    logging: false,
  },
  production: {
    storage: appDataDir,
    dialect: 'sqlite',
    logging: false,
  },
};
