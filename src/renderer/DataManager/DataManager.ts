// import WorkerManager from 'workers/WorkerManager';
import { IDeviceInfo } from '@electron/devices/Reader';
import WorkerManager from 'workers/WorkerManager';

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
    this.dataArrayBuf = null;
    this.dataCount = 0;
    this.data = [];
    this.timeStamp = 0;
    // this.listenForDeviceData();
  }

  /**
   * Starts the data listeners and prepares data processing
   */
  public initDataManager = () => {
    const deviceInfo = {
      samplingRate: 100,
      dataByteSize: 127,
      batchSize: 25,
      numOfElementsPerDataPoint: 12,
    };
    let count = 0;

    const calculationMsgPorts = new MessageChannel();
    const deviceMsgPorts = new MessageChannel();

    // Device worker data
    const deviceWorker = WorkerManager.getDeviceWorker();
    deviceWorker?.postMessage('start', [deviceMsgPorts.port1]);
    deviceMsgPorts.port1.start();
    deviceMsgPorts.port2.start();

    // // Calc worker data
    const calcWorker = WorkerManager.getCalculationWorker() as Worker;
    const calcWorkerData: IWorkerData = {
      deviceInfo: deviceInfo,
    };
    calcWorker.postMessage(calcWorkerData, [deviceMsgPorts.port2]);
    calculationMsgPorts.port1.start();
    calculationMsgPorts.port2.start();

    calculationMsgPorts.port1.addEventListener('message', (event) => {
      const DATA_LENGTH = event.data.length;

      for (let i = 0; i < DATA_LENGTH; i += 1) {
        if (count === 200) {
          // window.api.sendIPC('db:data', this.data);
          this.data.length = 0;
          count = 0;
        }
        const dataObj = {
          timeStamp: this.timeStamp / 1000,
          O2Hb: event.data[i][0],
          HHb: event.data[i][1],
          THb: event.data[i][2],
          TOI: event.data[i][3],
          PDRawData: event.data[i].slice(4, 10).join(','),
          LEDIntensities: event.data[i].slice(10, 15).join(','),
          gainValues: JSON.stringify({ preGain: 'HIGH', gain: 0 }),
          event: null,
          events: null,
          recordingId: 1,
        };

        this.data.push(dataObj);

        this.timeStamp += 10;
        count += 1;
      }
    });
  };

  stopDataManager = () => {
    const deviceWorker = WorkerManager.getDeviceWorker();
    deviceWorker.postMessage('stop');
    this.timeStamp = 0;
  };
}

export default new DataManager();
export interface IDataManager extends DataManager {}
