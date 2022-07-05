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
  protected services: IServices[];

  constructor() {
    this.databaseService = new DatabaseService();
    this.services = [this.databaseService];
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
    const promises: Promise<boolean>[] = [];

    this.services.forEach(async (service) => {
      promises.push(service.initService());
    });

    await Promise.all(promises);
  }
}

export default new ServiceManager();
