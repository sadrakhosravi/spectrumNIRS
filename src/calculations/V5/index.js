'use strict';
exports.__esModule = true;
var ml_matrix_1 = require('ml-matrix');
var e_coef_1 = require('./e_coef');
/**
 * Calculations of the V5 device channels
 */
var V5Calculation = /** @class */ (function () {
  /**
   * The number of data points in the dataBatch array.
   */
  function V5Calculation() {
    var _this = this;
    /**
     *
     * @param data
     * @returns
     */
    this.processRawData = function (dataBatch, batchSize) {
      var arrayIndex = 0;
      var NUM_OF_RAW_PD_VALUES = 6; // Number of elements per each sample data point
      var calculatedData = new Array(batchSize);
      // For each batch, go through individual data point and calculate the values
      for (var i = 0; i < batchSize; i += 1) {
        // Prepare arrays for calculation
        var rawPDValues = dataBatch.slice(
          arrayIndex,
          arrayIndex + NUM_OF_RAW_PD_VALUES
        );
        arrayIndex += NUM_OF_RAW_PD_VALUES;
        var LEDIntValues = dataBatch.slice(
          arrayIndex,
          arrayIndex + _this.NUM_OF_LEDs
        );
        arrayIndex += _this.NUM_OF_LEDs + 1;
        // Calculate values
        var dataArray = _this.calcHemodynamics(rawPDValues);
        dataArray.push(_this.calcTOI(rawPDValues, LEDIntValues));
        calculatedData[i] = dataArray;
      }
      return calculatedData;
    };
    /**
     * Creates an array of number that is used as an index to access the e_coef values
     * @returns the wave index used to find the HBCoefficients
     */
    this.calcWaveIndex = function () {
      return _this.wavelengths.map(function (wavelength) {
        return Math.round((wavelength - 599.9) / 0.1);
      });
    };
    /**
     * Calculates the HB coefficient columns by using the waveIndex indices and grabbing them from the e_coef file.
     * @returns an array of Float32Arrays containing the HB coefficient columns found in e_coef.
     */
    this.calcHBCoef = function () {
      var HBCoef1 = new Float32Array(_this.waveIndex.length);
      var HBCoef2 = new Float32Array(_this.waveIndex.length);
      // Set the HB coefficients from the e_coef file
      _this.waveIndex.forEach(function (waveIdx, i) {
        HBCoef1[i] = e_coef_1.col3[waveIdx];
        HBCoef2[i] = e_coef_1.col2[waveIdx];
      });
      return [HBCoef1, HBCoef2];
    };
    /**
     *  Calculates the pseudo inverse of the HB coefficient by creating a matrix of it
     * @returns the pseudoInverse of the HBCoefficients as an array of Float32Arrays
     */
    this.calcPseudoInverse = function () {
      var _matrixA = [];
      // Creates a 5 x 2 matrix to be used to get its pinv
      _this.HBCoef[0].forEach(function (_coef, i) {
        _matrixA.push([_this.HBCoef[0][i], _this.HBCoef[1][i]]);
      });
      var matrixA = new ml_matrix_1.Matrix(_matrixA);
      // Calculates the pinv of the matrix and multiplies it by -1 -- Matlab code: -pinv(matrixA)
      // @ts-ignore
      return (0, ml_matrix_1.pseudoInverse)(matrixA).multiply(-1).data;
    };
    /**
     * Calculates the O2Hb, HHb, and THb values from the raw intensities read from the sensor
     * uses the Raw PD readings (ADC) values.
     */
    this.calcHemodynamics = function (rawPDValues) {
      var data = new Float32Array(rawPDValues.slice(0, rawPDValues.length - 1));
      var baseline = rawPDValues[rawPDValues.length - 1];
      // Use for loop for the best performance possible
      for (var i = 0; i < _this.NUM_OF_LEDs; i += 1) {
        data[i] = (data[i] - baseline) / 4096;
        // If the value is less than 0.01, replace it with 0.01
        if (data[i] < 0.01) data[i] = 0.01;
        data[i] = Math.log(data[i]);
      }
      var O2Hb = 0;
      var HHb = 0;
      // Use matrix dot product to calculate O2HB and HHb
      for (var i = 0; i < _this.NUM_OF_LEDs; i++) {
        O2Hb += data[i] * _this.A[0][i];
        HHb += data[i] * _this.A[1][i];
      }
      O2Hb = Math.abs(O2Hb);
      HHb = Math.abs(HHb);
      // Check for values to make sense
      if (O2Hb < 0.1 && O2Hb > 0.01) {
        O2Hb = O2Hb * 100;
      }
      if (O2Hb < 0.01) {
        O2Hb = O2Hb * 1000;
      }
      if (HHb < 0.1 && HHb > 0.01) {
        HHb = HHb * 100;
      }
      if (HHb < 0.01) {
        HHb = HHb * 1000;
      }
      var THb = O2Hb + HHb;
      var calculatedData = [O2Hb, HHb, THb]; // The last value (0) will be filled by TOI
      return calculatedData;
    };
    /**
     * Calculates the Tissue Oxygenation Index from the intensities and raw PD (ADC) values
     * @returns the TOI calculated from the intensities and raw PD (ADC) values from the sensor
     */
    this.calcTOI = function (rawPDValues, LEDIntValues) {
      // Remove 3rd element of the array - Used to normalize
      var Amp_coef = new Float32Array([
        (LEDIntValues[0] / 255) * 4095,
        (LEDIntValues[1] / 255) * 4095,
        (LEDIntValues[3] / 255) * 4095,
        (LEDIntValues[4] / 255) * 4095,
      ]);
      // Normalize based on one Raw PD (ADC) value - LED 3 Wavelength chosen here
      var L_coefreq = new Float32Array([
        rawPDValues[0] / rawPDValues[2],
        rawPDValues[1] / rawPDValues[2],
        rawPDValues[3] / rawPDValues[2],
        rawPDValues[4] / rawPDValues[2],
      ]);
      // Create an array of size: number of LEDs and fill it with 1.0
      // This is used to make the array the same size as the number of LEDs
      // while the L_coefreq and Amp_coef size is 1 less than the number of LEDs
      // fill the rest with 1.0
      var OD_Test = new Float32Array(_this.NUM_OF_LEDs).fill(1.0);
      var TOI = 0;
      for (var i = 0; i < _this.NUM_OF_LEDs; i++) {
        // Only do the operation for the same size(4) of L_coefreq and Amp_coef arrays
        if (i !== _this.NUM_OF_LEDs - 1)
          OD_Test[i] = Math.log(L_coefreq[i] / Amp_coef[i]) * -1;
        TOI += _this.c_beta[i] * OD_Test[i];
      }
      // Take the absolute value and multiply by 100 to get a positive percentage
      TOI = Math.abs(TOI) * 100;
      if (!TOI || TOI === Infinity) TOI = 0;
      return TOI;
    };
    this.NUM_OF_LEDs = 5;
    this.wavelengths = new Uint16Array([670, 730, 810, 850, 950]);
    this.c_beta = new Float32Array([
      -1.2132, -0.0728, 1.8103, 1.1433, -11.5816,
    ]);
    this.waveIndex = this.calcWaveIndex();
    this.HBCoef = this.calcHBCoef();
    this.A = this.calcPseudoInverse();
    console.log('V5CALC');
  }
  return V5Calculation;
})();
exports['default'] = V5Calculation;
