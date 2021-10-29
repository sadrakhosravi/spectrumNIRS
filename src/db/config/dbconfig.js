const { app } = require('electron');
const path = require('path');

const appDataDir = path.join(
  app.getPath('appData'),
  'PhotonLab',
  'database',
  'main.db'
);

console.log(appDataDir);

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
