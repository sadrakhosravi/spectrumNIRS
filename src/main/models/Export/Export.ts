import V5Calculation from 'calculations/V5/V5Calculation';
import fs from 'fs';
import { IRecordingData } from '../RecordingModel';

// Methods
import spacedExport from './formats/spacedExport';
import commaExport from './formats/commaExport';
import DownSampler from 'calculations/DownSampler';
import DatabaseOperations from '../Database/DatabaseOperations';
import FixSamplingRate from '@lib/Device/FixSamplingRate';
import msToTime from '@utils/msToTime';

export type ExportTypes = 'csv' | 'txt';

type YesNo = 'Yes' | 'No';
export interface IExportOptions {
  downSampledRate: string;
  splitter: 'Space' | 'Comma';
  parameterNames: YesNo;
  fixSamplingRate: YesNo;
  headers: YesNo;
  start: undefined; // For now
  end: undefined; // For now
}

export enum SEPARATOR_CHAR {
  TAB = '\t',
  NEW_LINE = '\n',
  COMMA = ',',
}

/**
 * Export Class
 * Includes all the necessary export tools and options
 * @version 0.1.0
 */
class Export {
  /**
   * Export file type - Defaults to CSV
   */
  private type: ExportTypes;
  private savePath: string;
  private recording: IRecordingData;
  protected options: IExportOptions;

  /**
   * [data, timeStamp, events, other]
   */
  data: any[];
  unPackedData: any[];
  headerData: any[];

  downSampledRate: number | undefined;
  writeStream: null | fs.WriteStream;
  timeSequence: number;
  timeDelta: number;
  duration: number;

  calc: V5Calculation;
  separator: SEPARATOR_CHAR;

  // Methods
  spacedExport: () => void;
  commaExport: () => void;

  constructor(
    savePath: string,
    recording: IRecordingData,
    data: any[],
    options: IExportOptions
  ) {
    this.type = 'csv'; // Default to csv
    this.savePath = savePath;
    this.recording = recording;
    this.options = options;
    this.data = data;
    this.headerData = [];
    this.unPackedData = [];
    this.downSampledRate = ~~options.downSampledRate;

    this.writeStream = null;
    this.timeSequence = 0;
    this.timeDelta = 0;
    this.duration = 0;

    this.calc = new V5Calculation(this.recording.probeSettings.intensities);
    this.separator = SEPARATOR_CHAR.COMMA;

    this.spacedExport = spacedExport.bind(this);
    this.commaExport = commaExport.bind(this);
  }

  /**
   * Runs the export
   * @param type the file type
   * @returns a promise that gets resolved when the operation is done
   */
  public init(type: ExportTypes): Promise<boolean> {
    return new Promise((resolve) => {
      this.type = type;

      // Unpacks the binary data
      this.unPackData();

      // Creates the write stream
      this.createWriteStream();

      // Determines the separator type
      this.setSeparatorType();

      // Calculated the time data
      this.calcTimeDelta();

      if (this.options.fixSamplingRate === 'Yes') {
        // Fixes the sampling rate if it is not consistent
        const fixSampler = new FixSamplingRate(
          this.unPackedData,
          this.duration,
          this.recording.probeSettings.samplingRate
        );
        fixSampler.addMissingSamples();
      }

      // Check and down sample if needed
      this.checkAndDownSample();

      // Calculated the time data
      this.calcTimeDelta();

      // Write headers
      this.writeFileHeaders();

      setTimeout(async () => {
        // Run parser
        await this.runExportParser();

        // Cleanup
        this.cleanup();

        resolve(true);
      }, 1000);
    });
  }

  /**
   * Unpacks the data and overwrites the binary data in memory
   */
  private unPackData() {
    const dataLength = this.data.length;

    this.headerData.push(this.data[0]);
    this.headerData.push(this.data[this.data.length - 1]);

    for (let i = 0; i < dataLength; i += 1) {
      this.unPackedData.push(DatabaseOperations.parseData(this.data[i][0]));
      this.data[i] = null;
    }

    this.unPackedData = this.unPackedData.flat();
  }

  /**
   * Checks if it should down sample the data and replaces the data if so
   */
  private checkAndDownSample() {
    let downSampler;
    if (
      this.downSampledRate &&
      this.downSampledRate !== this.recording.probeSettings.samplingRate
    ) {
      downSampler = new DownSampler(
        this.recording.probeSettings.samplingRate,
        this.downSampledRate,
        this.unPackedData.length,
        this.recording.deviceSettings.devicePDs[0].channels + 1,
        1
      );
      const test = downSampler.downSampleDataSync(this.unPackedData);
      this.unPackedData = test;
    }
  }

  /**
   * Creates the write stream based on the savePath and file type
   */
  private createWriteStream() {
    this.writeStream = fs.createWriteStream(
      this.savePath + '.' + this.type,
      'utf-8'
    );
  }

  /**
   * Sets the separator character based on file type
   */
  private setSeparatorType() {
    switch (this.options.splitter) {
      case 'Comma':
        this.separator = SEPARATOR_CHAR.COMMA;
        break;

      case 'Space':
        this.separator = SEPARATOR_CHAR.TAB;
        break;

      default:
        this.separator = SEPARATOR_CHAR.COMMA;
        break;
    }
  }

  /**
   * Calculates the time delta based on the sampling rate
   * Assumes the samples are consistent
   */
  private calcTimeDelta() {
    const startTime = this.headerData[0][1] - 5000;
    const endTime = this.headerData[1][1];

    const durationInMS = endTime - startTime;
    const totalDataPoints = this.unPackedData.length;
    const timeDelta = durationInMS / totalDataPoints;
    this.duration = durationInMS;

    // If downsampled has been specified
    if (
      this.downSampledRate &&
      this.downSampledRate !== this.recording.probeSettings.samplingRate
    ) {
      // Check if the downsampled rate is a whole number
      if (this.downSampledRate % 1 !== 0) {
        throw new Error(
          'The down sampled rate cannot be a float! Try int numbers only.'
        );
      }

      this.timeDelta = ~~timeDelta.toFixed(2);
      return;
    }
    this.timeDelta = ~~timeDelta.toFixed(2);
  }

  /**
   * Writes data headers to file
   */
  private writeFileHeaders() {
    // Interval
    const intervalFormat = `Interval= ${this.separator} ${
      this.timeDelta / 1000
    } s`;

    // Start time of the recording
    const startTime = new Date(this.headerData[0][1] - 5000);
    const endTime = new Date(this.headerData[1][1]);
    const duration = this.headerData[1][1] - this.headerData[0][1];

    const startTimeOfDay = `Start Time of Day= ${startTime.toLocaleString()} + ${startTime.getMilliseconds()} ms`;
    const endTimeOfDay = `End Time of Day= ${endTime.toLocaleString()} + ${startTime.getMilliseconds()} ms`;

    // LED Intensities
    const LEDInt = `LED Intensities= ${this.recording.probeSettings.intensities.join(
      this.separator
    )}`;

    if (this.options.headers === 'Yes') {
      // Write the data
      this.writeStream?.write(
        `${intervalFormat} ${SEPARATOR_CHAR.NEW_LINE}${startTimeOfDay} ${SEPARATOR_CHAR.NEW_LINE}${endTimeOfDay} ${SEPARATOR_CHAR.NEW_LINE}`
      );
      this.writeStream?.write(
        `Duration=, ${msToTime(duration)}, ${duration}(milliseconds) ${
          SEPARATOR_CHAR.NEW_LINE
        }`
      );
      this.writeStream?.write(`${LEDInt} ${SEPARATOR_CHAR.NEW_LINE}`);
    }
  }

  /**
   * Determines which export parser to run based on this.type
   */
  private async runExportParser() {
    switch (this.options.splitter) {
      case 'Comma':
        await this.commaExport();
        break;

      case 'Space':
        await this.spacedExport();
        break;

      default:
        await this.spacedExport();
        break;
    }
  }

  /**
   * Cleanup of the data and other functions
   */
  private cleanup() {
    this.writeStream?.close();
    this.data.length = 0;
  }
}

export default Export;
