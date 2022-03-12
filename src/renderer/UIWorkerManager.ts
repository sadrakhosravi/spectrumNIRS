class UIWorkerManager {
  private databaseWorker: undefined | Worker;
  // private eventsWorker: undefined | Worker;
  private calcWorker: undefined | Worker;
  private exportdataWorker: undefined | Worker;
  constructor() {
    this.databaseWorker = undefined;
    // this.eventsWorker = undefined;
    this.calcWorker = undefined;
    this.exportdataWorker = undefined;
  }

  /**
   * @returns the UI database worker
   */
  getDatabaseWorker() {
    if (!this.databaseWorker) {
      this.databaseWorker = new Worker(
        //@ts-ignore
        new URL('../workers/database.worker.ts', import.meta.url)
      );
    }
    return this.databaseWorker;
  }

  terminateDatabaseWorker() {
    if (this.databaseWorker) {
      this.databaseWorker.terminate();
      this.databaseWorker = undefined;
    }
  }
  /**
   * @returns the UI database worker
   */
  getCalcWorker() {
    if (!this.calcWorker) {
      this.calcWorker = new Worker(
        //@ts-ignore
        new URL('../workers/calculation.worker.ts', import.meta.url)
      );
    }
    return this.calcWorker;
  }

  terminateCalcWorker() {
    if (this.calcWorker) {
      this.calcWorker.terminate();
      this.calcWorker = undefined;
    }
  }

  /**
   * @returns the UI database worker
   */
  getExportdataWorker() {
    if (!this.exportdataWorker) {
      this.exportdataWorker = new Worker(
        //@ts-ignore
        new URL('../workers/exportdata.worker.ts', import.meta.url)
      );
    }
    return this.exportdataWorker;
  }

  terminateExportdataWorker() {
    if (this.exportdataWorker) {
      this.exportdataWorker.terminate();
      this.exportdataWorker = undefined;
    }
  }
}

export default new UIWorkerManager();
