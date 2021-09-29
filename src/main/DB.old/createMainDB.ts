//@ts-nocheck

const Database = require('better-sqlite3');
const db = new Database(`${__dirname}/main.db`, { verbose: console.log });

// only for debug
const { hrtime } = require('process');

/**
 * Creates the main database
 */
exports.createMainDB = () => {
  var start: any = hrtime.bigint();

  // creates a new db if not exists

  const dropTable = db.prepare('DROP TABLE IF EXISTS experiments');

  // db query for creating the experiments table
  const experimentsTable = db.prepare(
    `CREATE TABLE IF NOT EXISTS experiments (
      name varchar NOT NULL,
      description text NULL,
      date date NOT NULL,
      settings text NULL
        );`
  );

  dropTable.run();
  experimentsTable.run();

  // enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  // increase db cache size - to be able to cache more points and read from memory rather than disk
  db.pragma('cache_size = 64000');

  // check performance
  var stop: any = hrtime.bigint();
  console.log(stop - start);
};

const insertDB = db.prepare(
  `INSERT INTO experiments (name, date) VALUES (? , ?)`
);

exports.sampleEntries = () => {
  insertDB.run('TESTING', '2021-09-28');
};
