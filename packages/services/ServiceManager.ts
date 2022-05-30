/*---------------------------------------------------------------------------------------------
 *  Service Manager.
 *  Initializes and manages all services.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// Default Services
import { DatabaseService } from './DatabaseService';
import { ElectronStoreService } from './ElectronStoreService';

// Interfaces
import type { IServices } from './IServicesInterface';

export class ServiceManager {
  /**
   * The database service instance.
   */
  private databaseService: DatabaseService;
  /**
   * The electron store service instance.
   */
  private electronStoreService: ElectronStoreService;

  /**
   * All services instance.
   */
  private services: IServices[];

  constructor() {
    this.databaseService = new DatabaseService();
    this.electronStoreService = new ElectronStoreService();
    this.services = [this.databaseService, this.electronStoreService];
  }

  /**
   * The database service connection instance.
   */
  public get dbConnection() {
    return this.databaseService.connection;
  }

  /**
   * The electron store service instance.
   */
  public get store() {
    return this.electronStoreService.store;
  }

  /**
   * Starts the service manager and all sub services.
   */
  public async init() {
    this.services.forEach(async (service) => await service.initService());
    console.log('initialized');
  }
}

let serviceManager: ServiceManager;

(async () => {
  serviceManager = new ServiceManager();
  await serviceManager.init();
})();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default serviceManager;
