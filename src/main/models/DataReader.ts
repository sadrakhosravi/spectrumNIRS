// Data Readers
import NIRSV5 from '../dataReaders/NIRSV5';
import Recording from './Recording';

export interface IDataReaders {
  /**
   * Starts reading data from the sensor.
   */
  startRecording(): void;
  /**
   * Stops reading data and kills the process.
   */
  stopRecording(): void;
  /**
   * Pauses reading data.
   */
  pauseRecording(): void;
  /**
   * Continues reading data.
   */
  continueRecording(): void;
  /**
   * Toggles the data to either display raw data or the calculated values.
   */
  toggleRawData(): void;
}

type CurrentSensor = {
  start: (
    lastTimeSequence: number | undefined,
    insertRecordingData: (data: unknown) => Promise<any>,
    sender: any
  ) => void;
  pause: () => void;
  continueRecording: (sender: any) => void;
  stop: () => number;
  toggleRawData: () => void;
};

/**
 * Controls reading data from the specified sensor
 */
export class DataReader implements IDataReaders {
  sensor: number;
  patientId: number;
  currentSensor: CurrentSensor;
  dataReader: any[] = [NIRSV5];
  lastTimeSequence: number;
  Recording: Recording;
  senderWindow: Electron.WebContents;

  constructor(
    patientId: number,
    sensorId: number,
    senderWindow: Electron.WebContents
  ) {
    this.sensor = sensorId;
    this.patientId = patientId;
    this.senderWindow = senderWindow;
    this.currentSensor = this.dataReader[this.sensor]; // Selects the sensor
    this.Recording = new Recording(this.patientId);
    this.lastTimeSequence = 0;
  }

  startRecording() {
    this.currentSensor.start(
      this.lastTimeSequence,
      this.Recording.insertRecordingData,
      this.senderWindow
    );
  }

  stopRecording() {
    this.currentSensor.stop();
    this.lastTimeSequence = 0;
  }

  pauseRecording() {
    const lastTimeSequence = this.currentSensor.stop();
    this.lastTimeSequence = lastTimeSequence;
    console.log(this.lastTimeSequence);
  }

  continueRecording() {
    this.startRecording();
  }

  toggleRawData() {
    this.currentSensor.toggleRawData();
  }
}

export default DataReader;