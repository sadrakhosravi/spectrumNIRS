import { DeviceDataType } from '@electron/models/DeviceReader/DeviceDataTypes';
import { Matrix, pseudoInverse } from 'ml-matrix';
import { col2, col3 } from './e_coef';
/**
 * Calculations of the V5 device channels
 */
class V5Calculation {
  private LEDIntensities: number[];

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
   * The number of data points in the dataBatch array.
   */

  constructor(LEDIntensities: number[]) {
    this.LEDIntensities = LEDIntensities;
    this.NUM_OF_LEDs = 5;
    this.wavelengths = new Uint16Array([950, 730, 810, 850, 650]);
    this.c_beta = new Float32Array([
      -1.2132, -0.0728, 1.8103, 1.1433, -11.5816,
    ]);
    this.waveIndex = this.calcWaveIndex();
    this.HBCoef = this.calcHBCoef();
    this.A = this.calcPseudoInverse();
    console.log('V5CALC');
  }

  /**
   *
   * @param data
   * @returns
   */
  public processRawData = (
    data: DeviceDataType[],
    batchSize: number,
    timeStamp = 0,
    timeDelta = 10
  ): number[][] => {
    const calculatedData: any[] = new Array(batchSize);
    let tDelta = 0;
    // For each batch, go through individual data point and calculate the values
    for (let i = 0; i < batchSize; i += 1) {
      // Calculate values
      const dataArray = this.calcHemodynamics(data[i].ADC1);
      dataArray[dataArray.length - 1] = this.calcTOI(data[i].ADC1);
      dataArray[0] = timeStamp + tDelta;
      calculatedData[i] = dataArray;

      tDelta += timeDelta;
    }
    return calculatedData;
  };

  /**
   * Creates an array of number that is used as an index to access the e_coef values
   * @returns the wave index used to find the HBCoefficients
   */
  private calcWaveIndex = () => {
    return this.wavelengths.map((wavelength) =>
      Math.round((wavelength - 599.9) / 0.1)
    );
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
  public calcHemodynamics = (rawPDValues: number[]) => {
    const data = new Float32Array(rawPDValues.slice(0, rawPDValues.length - 1));
    const baseline = rawPDValues[rawPDValues.length - 1];

    // Subtract the baseline from each raw value and divide by 4096
    for (let i = 0; i < this.NUM_OF_LEDs; i += 1) {
      data[i] = (data[i] - baseline) / 4096;

      // If the value is less than 0.001, replace it with 0.001
      if (data[i] < 0.001) data[i] = 0.001;

      data[i] = Math.log(data[i]);
    }

    let O2Hb = 0;
    let HHb = 0;

    // Use matrix dot product to calculate O2HB and HHb
    for (let i = 0; i < this.NUM_OF_LEDs; i++) {
      O2Hb += data[i] * this.A[0][i];
      HHb += data[i] * this.A[1][i];
    }

    O2Hb = Math.abs(O2Hb);
    HHb = Math.abs(HHb) * -5;

    const THb = O2Hb + Math.abs(HHb);
    const calculatedData = [0, O2Hb, HHb, THb, 0]; // The last value (0) will be filled by TOI

    return calculatedData;
  };

  /**
   * Calculates the Tissue Oxygenation Index from the intensities and raw PD (ADC) values
   * @returns the TOI calculated from the intensities and raw PD (ADC) values from the sensor
   */
  private calcTOI = (rawPDValues: number[]) => {
    // Remove 3rd element of the array - Used to normalize
    const Amp_coef = new Float32Array([
      (this.LEDIntensities[0] / 255) * 4095,
      (this.LEDIntensities[1] / 255) * 4095,
      (this.LEDIntensities[3] / 255) * 4095,
      (this.LEDIntensities[4] / 255) * 4095,
    ]);

    // Normalize based on one Raw PD (ADC) value - LED 3 Wavelength chosen here
    const L_coefreq = new Float32Array([
      rawPDValues[0] / rawPDValues[2],
      rawPDValues[1] / rawPDValues[2],
      rawPDValues[3] / rawPDValues[2],
      rawPDValues[4] / rawPDValues[2],
    ]);

    // Create an array of size: number of LEDs and fill it with 1.0
    // This is used to make the array the same size as the number of LEDs
    // while the L_coefreq and Amp_coef size is 1 less than the number of LEDs
    // fill the rest with 1.0
    const OD_Test = new Float32Array(this.NUM_OF_LEDs).fill(1.0);
    let TOI = 0;

    for (let i = 0; i < this.NUM_OF_LEDs; i++) {
      // Only do the operation for the same size(4) of L_coefreq and Amp_coef arrays
      if (i !== this.NUM_OF_LEDs - 1)
        OD_Test[i] = Math.log(L_coefreq[i] / Amp_coef[i]) * -1;

      TOI += this.c_beta[i] * OD_Test[i];
    }

    // Take the absolute value and multiply by 100 to get a positive percentage
    TOI = Math.abs(TOI) * 100;
    if (!TOI || TOI === Infinity) TOI = 0;

    // FIXME: Fix TOI Coefficients
    TOI = TOI / 2.25;

    return TOI;
  };
}

export default V5Calculation;
