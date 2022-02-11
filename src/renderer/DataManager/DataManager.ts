// import WorkerManager from 'workers/WorkerManager';
import { IDeviceInfo } from 'devices/Reader';

export interface IWorkerData {
  deviceInfo: IDeviceInfo;
}

/**
 * Manages the incoming data stream from a device to the UI
 */
class DataManager {
  deviceInfo: IDeviceInfo | null;
  dataCount: number;
  dataArrayBuf: null | any;
  dataListeningPort: MessagePort | null;
  data: any[];
  timeStamp: number;

  constructor() {
    this.deviceInfo = null;
    this.dataListeningPort = null;
    this.dataCount = 0;
    this.data = [];
    this.timeStamp = 0;

    this.initDataManager();
  }

  /**
   * Starts the data listeners and prepares data processing
   */
  public initDataManager() {}

  stopDataManager() {}
}

export default new DataManager();
export interface IDataManager extends DataManager {}
