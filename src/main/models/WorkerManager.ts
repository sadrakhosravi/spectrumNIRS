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
  getCalculationWorker() {
    if (!this.calculationWorker) {
      this.calculationWorker = new Worker(
        path.join(this.workersPath, 'calculation.worker.js')
      );
    }
    return this.calculationWorker as Worker;
  }

  /**
   * @returns the database worker thread
   */
  getDatabaseWorker(dbFilePath?: string) {
    if (!this.databaseWorker) {
      this.databaseWorker = new Worker(
        path.join(this.workersPath, 'database.worker.js'),
        { workerData: dbFilePath || databaseFile }
      );
    }
    return this.databaseWorker as Worker;
  }
}

export default new WorkerManager();
