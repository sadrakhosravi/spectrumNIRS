class WorkerManager {
  eventsWorker: Worker | null;
  calculationWorker: Worker | null;
  databaseWorker: Worker | null;
  constructor() {
    console.log('WORKER MANAGERRR');
    this.eventsWorker = null;
    this.calculationWorker = null;
    this.databaseWorker = null;

    console.log(process.resourcesPath);
  }

  /**
   * @returns the events web worker
   */
  public getEventsWorker = () => this.eventsWorker;

  /**
   * @returns the calculation web worker
   */
  public getCalculationWorker = () => this.calculationWorker;

  /**
   * @returns the database web worker
   */
  public getDatabaseWorker = () => this.databaseWorker;

  /**
   * Starts the events web worker if not active and returns it
   * @returns events worker
   */
  public startEventsWorker() {
    if (!this.eventsWorker) {
      this.eventsWorker = new Worker(
        //@ts-ignore
        new URL('./events.worker.js', import.meta.url)
      );
    }
    return this.eventsWorker;
  }

  /**
   * Starts the database web worker if not active and returns it
   * @returns database worker
   */
  public startDatabaseWorker = () => {
    if (!this.databaseWorker) {
      this.databaseWorker = new Worker(
        //@ts-ignore
        new URL('./database.worker.js', import.meta.url)
      );
    }
    return this.databaseWorker;
  };

  public terminateAllWorkers = () => {
    this.calculationWorker?.terminate();
    this.eventsWorker?.terminate();
    this.databaseWorker?.terminate();
  };
}

export default new WorkerManager();
