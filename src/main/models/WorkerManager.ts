import { app } from 'electron';
import path from 'path';
import { Worker } from 'worker_threads';
import { databaseFile } from '../paths';

class WorkerManager {
  calculationWorker: Worker | null;
  databaseWorker: Worker | null;
  workersPath: string;
  constructor() {
    this.calculationWorker = null;
    this.databaseWorker = null;
    this.workersPath = app.isPackaged
      ? __dirname
      : path.join(__dirname, '../../workers');
  }

  /**
   * @returns the calculation worker thread
   */
  getCalculationWorker(workerData?: any) {
    if (!this.calculationWorker) {
      this.calculationWorker = new Worker(
        path.join(this.workersPath, 'calculation.worker.js'),
        {
          workerData,
        }
      );
    }
    return this.calculationWorker as Worker;
  }

  /**
   * @returns the database worker thread
   */
  getDatabaseWorker(workerData?: any) {
    if (workerData) {
      Object.assign(workerData, { dbFilePath: databaseFile });
    }

    if (!this.databaseWorker) {
      this.databaseWorker = new Worker(
        path.join(this.workersPath, 'database.worker.js'),
        { workerData: workerData || { dbFilePath: databaseFile } }
      );
    }
    return this.databaseWorker as Worker;
  }

  terminateAllWorkers() {
    this.calculationWorker?.terminate();
    this.databaseWorker?.terminate();
  }
}

export default new WorkerManager();
