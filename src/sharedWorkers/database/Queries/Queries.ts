// Types
import type { DatabaseConnectionType } from '../types/Types';

export class Queries {
  protected readonly connection: DatabaseConnectionType;
  constructor(connection: DatabaseConnectionType) {
    this.connection = connection;
  }
}
