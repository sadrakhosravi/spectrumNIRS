/*---------------------------------------------------------------------------------------------
 *  Service Manager.
 *  Initializes and manages all services.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// Default Services
import { DatabaseService } from './DatabaseService';

// Interfaces
import type { IServices } from './IServicesInterface';

export class ServiceManager {
  /**
   * The database service instance.
   */
  private databaseService: DatabaseService;
  /**
   * All services instance.
   */
  private services: IServices[];

  constructor() {
    this.databaseService = new DatabaseService();
    this.services = [this.databaseService];

    (async () => {
      await this.init();
    })();
  }

  /**
   * The database service connection instance.
   */
  public get dbConnection() {
    return this.databaseService.connection;
  }

  /**
   * Starts the service manager and all sub services.
   */
  public async init() {
    this.services.forEach(async (service) => await service.initService());
    console.log('initialized');
  }
}

export default new ServiceManager();
