const createDatabase = () => {
  const Database = require('better-sqlite3');
  const recordDB = new Database(`${__dirname}/foobar.db`, {
    verbose: console.log,
  });

  const createTable =
    "CREATE TABLE IF NOT EXISTS users('name' varchar, 'surname' varchar, 'date_of_birth' DATE DEFAULT, 'email' varchar, 'username' varchar PRIMARY KEY, 'password' varchar );";

  recordDB.exec(createTable);
  console.log('Done');
};

module.exports = createDatabase;
