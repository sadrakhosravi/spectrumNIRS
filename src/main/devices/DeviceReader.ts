// Data Readers
import NIRSV5 from './nirsv5';
import { CurrentRecording } from 'controllers/recording';

type CurrentSensor = {
  start: (
    lastTimeSequence: number | undefined,
    isRawData: boolean,
    sender: any,
    recordingId: number
  ) => void;
  startQualityMonitor: (sender: any) => void;
  pause: () => void;
  continueRecording: (sender: any) => void;
  stop: () => number;
  toggleRawData: () => void;
  toggleEvent: (data: object) => void;
  syncGains: (data: string[]) => Promise<any>;
};

/**
 * Controls reading data from the specified sensor
 */
export class DataReader {
  sensor: number;
  patientId: number;
  isRawData: boolean;
  currentSensor: CurrentSensor;
  dataReader: any[] = [NIRSV5];
  lastTimeStamp: number;
  senderWindow: Electron.WebContents;
  currentRecording: CurrentRecording;

  constructor(
    patientId: number,
    sensorId: number,
    currentRecording: CurrentRecording,
    isRawData: boolean,
    lastTimeStamp: number,
    senderWindow: Electron.WebContents
  ) {
    this.sensor = sensorId;
    this.patientId = patientId;
    this.isRawData = isRawData;
    this.currentRecording = currentRecording;
    this.senderWindow = senderWindow;
    this.currentSensor = this.dataReader[this.sensor - 1]; // Selects the sensor
    this.lastTimeStamp = lastTimeStamp;
  }

  startRecording() {
    this.currentSensor.start(
      this.lastTimeStamp,
      this.isRawData,
      this.senderWindow,
      this.currentRecording.id
    );
  }

  stopRecording() {
    this.currentSensor && this.currentSensor.stop();
    this.lastTimeStamp = 0;
  }

  pauseRecording() {
    const lastTimeStamp = this.currentSensor.stop();
    this.lastTimeStamp = lastTimeStamp;
    console.log(this.lastTimeStamp);
  }

  continueRecording() {
    this.startRecording();
  }

  toggleRawData() {
    this.currentSensor.toggleRawData();
  }

  toggleEvent(data: object) {
    this.currentSensor.toggleEvent(data);
  }

  startQualityMonitor() {
    this.currentSensor.startQualityMonitor(this.senderWindow);
  }

  async syncGainsWithHardware(data: string[]): Promise<any> {
    return await this.currentSensor.syncGains(data);
  }
}

export default DataReader;
