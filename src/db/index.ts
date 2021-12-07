import { createConnection } from 'typeorm';

import path from 'path';
process.env.TZ = 'America/Vancouver'; // here is the magical line

// Paths
import { databasePath } from '../main/paths';

const createDBConnection = async () => {
  const connection = await createConnection({
    type: 'better-sqlite3',
    database: path.join(databasePath, 'mydb.db'),
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, './entity/*.ts')],
    migrations: ['src/db/migration/**/*.ts'],
    subscribers: ['src/db/subscriber/**/*.ts'],
  });

  connection.query('PRAGMA auto_vacuum = FULL');
  connection.query('PRAGMA main.cache_size = 32000');
};

export default createDBConnection;
