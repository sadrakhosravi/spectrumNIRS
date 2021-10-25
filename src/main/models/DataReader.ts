// Data Readers
import NIRSV5 from '../dataReaders/NIRSV5';
import Recording from './Recording';

export interface IDataReaders {
  /**
   * Starts reading data from the sensor.
   */
  startRecording(arg: any): void;
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
}

type CurrentSensor = {
  start: (
    lastTimeSequence: number | undefined,
    insertRecordingData: (data: unknown) => Promise<any>,
    sender: any
  ) => void;
  pause: () => void;
  continueRecording: () => void;
  stop: () => number;
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

  constructor(patientId: number, sensorId: number) {
    this.sensor = sensorId;
    this.patientId = patientId;
    this.currentSensor = this.dataReader[this.sensor]; // Selects the sensor
    this.Recording = new Recording(this.patientId);
    this.lastTimeSequence = 0;
  }

  startRecording(sender: any) {
    sender.send('testing:channel');
    this.currentSensor.start(
      this.lastTimeSequence,
      this.Recording.insertRecordingData,
      sender
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
    // this.startRecording();
  }
}

export default DataReader;
