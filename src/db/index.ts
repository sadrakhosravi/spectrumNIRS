import { createConnection } from 'typeorm';
import Experiments from './entity/Experiments';
import Patients from './entity/Patients';
import Recordings from './entity/Recordings';
import RecordingsData from './entity/RecordingsData';
import Probes from './entity/Probes';

// Paths
import { databaseFile } from '../main/paths';

const createDBConnection = async () => {
  const connection = await createConnection({
    type: 'better-sqlite3',
    database: databaseFile,
    synchronize: true,
    logging: false,
    statementCacheSize: 100 * 10,
    entities: [Experiments, Patients, Recordings, RecordingsData, Probes],
    migrations: ['src/db/migration/**/*.ts'],
    subscribers: ['src/db/subscriber/**/*.ts'],
  });

  setTimeout(async () => {
    await connection.query('PRAGMA auto_vacuum = INCREMENTAL;');
    await connection.query('PRAGMA main.cache_size = 32000;');
    await connection.query('PRAGMA synchronous = normal;');
    await connection.query('PRAGMA temp_store = memory;');
    await connection.query('PRAGMA mmap_size = 30000000;');
    await connection.query('PRAGMA journal_size_limit = 100000;');
  }, 100);
};

export default createDBConnection;
