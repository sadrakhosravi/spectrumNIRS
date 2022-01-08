const eventWorkers: Worker[] = [];
const deviceWorkers: Worker[] = [];

class WorkerManager {
  public static startEventsWorker() {
    const eventWorker = new Worker(
      //@ts-ignore
      new URL('./events.worker.js', import.meta.url)
    );
    eventWorkers.push(eventWorker);
    return eventWorker;
  }

  public static startDeviceWorker() {
    const deviceWorker = new Worker(
      //@ts-ignore
      new URL('./calculation.worker.js', import.meta.url)
    );
    deviceWorkers.push(deviceWorker);
    return deviceWorker;
  }

  public static startDatabaseWorker = () => {
    const databaseWorker = new Worker(
      //@ts-ignore
      new URL('./database.worker.js', import.meta.url)
    );
    return databaseWorker;
  };
}

export default WorkerManager;
