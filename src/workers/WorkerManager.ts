const workers: Worker[] = [];

class WorkerManager {
  static startEventsWorker() {
    const eventWorker = new Worker(
      //@ts-ignore
      new URL('./events.worker.js', import.meta.url)
    );
    workers.push(eventWorker);
    return eventWorker;
  }
}

export default WorkerManager;
