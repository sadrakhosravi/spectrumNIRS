import { getConnection } from 'typeorm';

class Database {
  constructor() {}

  vacuum = async () => {
    await getConnection().query('VACUUM;');
  };
}

export default new Database();
