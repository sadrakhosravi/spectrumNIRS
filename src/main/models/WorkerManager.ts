import { app } from 'electron';
import path from 'path';
import { Worker as WorkerThread } from 'worker_threads';
const { Worker } = require('worker_threads');

class WorkerManager {
  calculationWorker: WorkerThread | null;
  workersPath: string;
  constructor() {
    this.calculationWorker = null;
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

      this.calculationWorker?.on('exit', () => {
        console.log('CALCULATION WORKER EXITED');
      });

      this.calculationWorker?.setMaxListeners(2);
    }

    return this.calculationWorker as WorkerThread;
  }

  terminateAllWorkers() {
    this.calculationWorker?.terminate();

    //@ts-ignore
    this.calculationWorker = undefined;
  }
}

export default new WorkerManager();
