import { createConnection } from 'typeorm';
import path from 'path';
process.env.TZ = 'America/Vancouver'; // here is the magical line

// Paths
import { databasePath } from '../main/paths';

(async () => {
  await createConnection({
    type: 'better-sqlite3',
    database: path.join(databasePath, 'mydb.db'),
    synchronize: true,
    logging: false,
    entities: ['src/db/entity/**/*.ts'],
    migrations: ['src/db/migration/**/*.ts'],
    subscribers: ['src/db/subscriber/**/*.ts'],
  });
})();
