class WorkerManager {
  calculationWorker: Worker | null;
  eventsWorker: Worker | null;
  databaseWorker: Worker | null;

  constructor() {
    this.calculationWorker = null;
    this.eventsWorker = null;
    this.databaseWorker = null;
    console.log('WORKER MANAGER');
  }

  /**
   * @returns the calculation web worker
   */
  public getCalculationWorker = () => this.calculationWorker;

  /**
   * @returns the events web worker
   */
  public getEventsWorker = () => this.eventsWorker;

  /**
   * @returns the database web worker
   */
  public getDatabaseWorker = () => this.databaseWorker;

  /**
   * Starts the calculation web worker if not active and returns it
   * @returns calculation worker
   */
  public startCalculationWorker() {
    // if (!this.calculationWorker) {
    //   this.calculationWorker = new Worker(
    //     //@ts-ignore
    //     new URL('./calculation.worker.ts', import.meta.url)
    //   );
    // }
    return this.calculationWorker;
  }

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
    // if (!this.databaseWorker) {
    //   this.databaseWorker = new Worker(
    //     //@ts-ignore
    //     new URL('./database.worker.js', import.meta.url)
    //   );
    // }
    return this.databaseWorker;
  };

  public terminateAllWorkers = () => {
    this.calculationWorker?.terminate();
    this.eventsWorker?.terminate();
    this.databaseWorker?.terminate();
  };
}
export default new WorkerManager();
export interface IWorkerManager extends WorkerManager {}
