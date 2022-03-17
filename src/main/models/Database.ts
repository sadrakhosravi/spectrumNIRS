import { getConnection } from 'typeorm';

class Database {
  constructor() {}

  /**
   * Vacuums the database
   */
  public vacuum = async () => {
    await getConnection().query('VACUUM;');
  };
}

export default new Database();
