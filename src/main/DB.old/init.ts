// load modules

/**
 * Initializes all database files
 */
const init = async () => {
  // load modules - async
  const path = require('path');

  //@ts-ignore
  const { createMainDB } = require(path.join(
    __dirname,
    '../DB/createMainDB.ts'
  ));

  // init the main DB file
  createMainDB();
};

module.exports = init;
