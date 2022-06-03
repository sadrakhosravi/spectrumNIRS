import { Matrix, pseudoInverse } from 'ml-matrix';
import { col2, col3 } from './e_coef';

// Types
import type { DeviceCalculatedDataType, DeviceInfoType } from 'reader/api/Types';
import type { V5ParserDataType } from '../../V5/V5Parser';
import type { IDeviceCalculation } from 'reader/Interfaces';
import { BeastParserDataType } from '../BeastParser';

/**
 * Calculations of the V5 device channels
 */
class BeastCalculation implements IDeviceCalculation {
  private LEDIntensities: number[];
  /**
   * The device calculated channel names.
   */
  private calcChannelNames: string[];
  /**
   * The total number of LEDs of the device
   */
  private NUM_OF_LEDs: number;
  /**
   * The wavelengths of the V5 sensor LEDs
   */
  private wavelengths: Uint16Array;
  /**
   * Coefficients used for TOI calculation
   */
  private c_beta: Float32Array;
  /**
   * Coefficients used for HB coef calculation
   */
  private waveIndex: Uint16Array;
  /**
   * Coefficients used for hemodynamics calculation
   */
  private HBCoef: Float32Array[];
  /**
   * The coefficient used for calculating the hemodynamics values
   */
  private A: Float32Array[];
  /**
   * The number of data points to process at a time.
   * Cache the value for better performance.
   */
  private BATCH_SIZE: number;
  /**
   * The object to store the processed data.
   */
  private calcDataRes: DeviceCalculatedDataType;
  /**
   * The number of PD channels.
   */
  private PDChannels: number;
  /**
   * The array to store the calculated hemodynamics data.
   * The array format is `[O2Hb, HHb, THb]`.
   */
  private hemodynamicsArr: Float32Array;
  /**
   * Stores one sample of all PD channels as one data point.
   * The array format is `[ambient, ch1, ch2, ch3, ch4, ch5]`.
   */
  private dataPointArr: Float32Array;

  constructor() {
    this.LEDIntensities = [];
    this.calcChannelNames = [];

    this.NUM_OF_LEDs = 5;
    this.wavelengths = new Uint16Array([950, 730, 810, 850, 650]);
    this.c_beta = new Float32Array([-1.2132, -0.0728, 1.8103, 1.1433, -11.5816]);

    this.BATCH_SIZE = 32;
    this.PDChannels = 16;

    // Do the initial coefficient calculations.
    this.waveIndex = this.calcWaveIndex();
    this.HBCoef = this.calcHBCoef();
    this.A = this.calcPseudoInverse();

    // Defining arrays and objects here for functions use - Reason: Memory efficiency.
    this.dataPointArr = new Float32Array(10);
    this.hemodynamicsArr = new Float32Array(10).fill(0);

    // Create the final object that will be returned by processData
    this.calcDataRes = {};
  }

  /**
   * The number of data points to process at a time.
   */
  public get batchSize() {
    return this.BATCH_SIZE;
  }

  /**
   * Initializes the device calculation class.
   */
  public init(deviceInfo: DeviceInfoType) {
    this.LEDIntensities = new Array(deviceInfo.numOfChannelsPerPD).fill(0);
    this.calcChannelNames = deviceInfo.calculatedChannelNames;
    this.PDChannels = 6;

    // Setup the static objects
    this.dataPointArr = new Float32Array(this.PDChannels);
    this.hemodynamicsArr = new Float32Array(this.calcChannelNames.length - 1);

    this.createOutputObj();
  }

  /**
   * Sets the batch size used to cache the iterations of `processData` for loop.
   */
  public setBatchSize(newBatchSize: number) {
    this.BATCH_SIZE = newBatchSize;
  }

  /**
   * Sets the updated LED intensities of the device used for TOI calculation.
   */
  public setLEDIntensities(LEDIntensities: number[]) {
    console.log(LEDIntensities);
    if (LEDIntensities.length !== 16)
      throw new Error('The supplied LED intensities are not in the correct format for Beast.');
    this.LEDIntensities = LEDIntensities;
  }

  /**
   * Creates the output object. This is done only once for performance
   * and memory consumption.
   */
  private createOutputObj() {
    this.calcChannelNames.forEach((channelName) => {
      this.calcDataRes['ADC1'][channelName] = new Float32Array(this.BATCH_SIZE);
    });
  }

  /**
   * Calculates the NIRS parameters for beast and return an object containing the calculated values.
   */
  public processData = (data: BeastParserDataType) => {
    // Create an array to store once data point of the batch

    // For each batch, go through individual data point and calculate the values
    for (let i = 0; i < this.BATCH_SIZE; i += 1) {
      // Put one sample from the hardware into the dataPoint array.
      for (let j = 1; j < this.PDChannels; j++) {
        this.dataPointArr[j] = data.ADC3[('ch' + (j + 10)) as keyof V5ParserDataType['ADC1']][i];
      }

      this.dataPointArr[0] = data.ADC3.ch0[i];

      // Calculate that sample.
      this.calcHemodynamics(this.dataPointArr);
      this.calcDataRes['ADC1']['O2Hb'][i] = this.hemodynamicsArr[0];
      this.calcDataRes['ADC1']['HHb'][i] = this.hemodynamicsArr[1];
      this.calcDataRes['ADC1']['THb'][i] = this.hemodynamicsArr[2];
      this.calcDataRes['ADC1']['TOI'][i] = this.calcTOI(this.dataPointArr);
    }
    return this.calcDataRes;
  };

  /**
   * Creates an array of number that is used as an index to access the e_coef values
   * @returns the wave index used to find the HBCoefficients
   */
  private calcWaveIndex = () => {
    return this.wavelengths.map((wavelength) => Math.round((wavelength - 599.9) / 0.1));
  };

  /**
   * Calculates the HB coefficient columns by using the waveIndex indices and grabbing them from the e_coef file.
   * @returns an array of Float32Arrays containing the HB coefficient columns found in e_coef.
   */
  private calcHBCoef = () => {
    const HBCoef1 = new Float32Array(this.waveIndex.length);
    const HBCoef2 = new Float32Array(this.waveIndex.length);

    // Set the HB coefficients from the e_coef file
    this.waveIndex.forEach((waveIdx, i) => {
      HBCoef1[i] = col3[waveIdx];
      HBCoef2[i] = col2[waveIdx];
    });

    return [HBCoef1, HBCoef2];
  };

  /**
   *  Calculates the pseudo inverse of the HB coefficient by creating a matrix of it
   * @returns the pseudoInverse of the HBCoefficients as an array of Float32Arrays
   */
  private calcPseudoInverse = () => {
    const _matrixA: number[][] = [];

    // Creates a 5 x 2 matrix to be used to get its pinv
    this.HBCoef[0].forEach((_coef, i) => {
      _matrixA.push([this.HBCoef[0][i], this.HBCoef[1][i]]);
    });
    const matrixA = new Matrix(_matrixA);

    // Calculates the pinv of the matrix and multiplies it by -1 -- Matlab code: -pinv(matrixA)
    // @ts-ignore
    return pseudoInverse(matrixA).multiply(-1).data;
  };

  /**
   * Calculates the O2Hb, HHb, and THb values from the raw intensities read from the sensor
   * uses the Raw PD readings (ADC) values.
   */
  public calcHemodynamics = (sample: Float32Array) => {
    // Subtract the baseline from each raw value and divide by (4096 - ADC)
    // The first element of the sample array is the ambient/baseline
    for (let i = 1; i < this.PDChannels; i += 1) {
      sample[i] = (sample[i] - sample[0]) / 32767;

      // If the value is less than 0.001, replace it with 0.001
      if (sample[i] < 0.001) sample[i] = 0.001;

      sample[i] = Math.log(sample[i]);
    }

    let O2Hb = 0;
    let HHb = 0;

    // Use matrix dot product to calculate O2HB and HHb
    for (let i = 1; i < this.PDChannels; i++) {
      O2Hb += sample[i] * this.A[0][i - 1];
      HHb += sample[i] * this.A[1][i - 1];
    }

    // Final values
    O2Hb = Math.abs(O2Hb);
    HHb = Math.abs(HHb);

    // Insert the final values in the hemodynamics array.
    this.hemodynamicsArr[0] = O2Hb;
    this.hemodynamicsArr[1] = HHb;
    this.hemodynamicsArr[2] = O2Hb + HHb; // THb
  };

  /**
   * Calculates the Tissue Oxygenation Index from the intensities and raw PD (ADC) values
   * @returns the TOI calculated from the intensities and raw PD (ADC) values from the sensor
   */
  protected calcTOI = (sample: Float32Array) => {
    // Remove 3rd element of the array - Used to normalize
    const Amp_coef = new Float32Array([
      (this.LEDIntensities[11] / 255) * 32767,
      (this.LEDIntensities[12] / 255) * 32767,
      (this.LEDIntensities[13] / 255) * 32767,
      (this.LEDIntensities[14] / 255) * 32767,
    ]);

    // Normalize based on one Raw PD (ADC) value - LED 3 Wavelength chosen here
    const L_coefreq = new Float32Array([
      sample[1] / sample[3],
      sample[2] / sample[3],
      sample[4] / sample[3],
      sample[5] / sample[3],
    ]);

    // Create an array of size: number of LEDs and fill it with 1.0
    // This is used to make the array the same size as the number of LEDs
    // while the L_coefreq and Amp_coef size is 1 less than the number of LEDs
    // fill the rest with 1.0
    const OD_Test = new Float32Array(this.NUM_OF_LEDs).fill(1.0);
    let TOI = 0;

    for (let i = 0; i < this.NUM_OF_LEDs; i++) {
      // Only do the operation for the same size(4) of L_coefreq and Amp_coef arrays
      if (i !== this.NUM_OF_LEDs - 1) OD_Test[i] = Math.log(L_coefreq[i] / Amp_coef[i]) * -1;

      TOI += this.c_beta[i] * OD_Test[i];
    }

    // Take the absolute value and multiply by 100 to get a positive percentage
    TOI = TOI * 100;

    return TOI;
  };
}

export default BeastCalculation;
