import { app } from 'electron';
import path from 'path';
import { Worker } from 'worker_threads';

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

  getCalculationWorker() {
    if (!this.calculationWorker) {
      this.calculationWorker = new Worker(
        path.join(this.workersPath, 'calculation.worker.js')
      );
    }
    return this.calculationWorker;
  }
}

export default new WorkerManager();
