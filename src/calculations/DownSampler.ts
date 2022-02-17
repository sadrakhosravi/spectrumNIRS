class DownSampler {
  deviceSamplingRate: number;
  downSampledRate: number;
  downSamplingFactor: number;
  outputData: number[][];
  isDataReady: boolean;
  batchSize: number;
  elementsPerDP: any;
  temp: number[];
  count: number;
  numOfOutputData: number;
  sentOutputData: boolean;

  constructor(
    deviceSamplingRate: number = 100,
    downSampledRate: number = 20,
    batchSize: number,
    elementsPerDP: number
  ) {
    this.deviceSamplingRate = deviceSamplingRate;
    this.downSampledRate = downSampledRate;
    this.batchSize = batchSize;
    this.elementsPerDP = elementsPerDP;

    this.outputData = [];
    this.sentOutputData = false;
    this.temp = new Array(this.elementsPerDP).fill(0);

    this.isDataReady = false;
    this.count = 0;
    this.numOfOutputData = 1;

    // Check down sampled rate
    if (this.downSampledRate > this.deviceSamplingRate) {
      throw new Error(
        'The down sampled rate cannot be higher than the device sampling rate!'
      );
    }

    this.downSamplingFactor = this.deviceSamplingRate / this.downSampledRate;

    // Check sampling factor
    if (this.downSamplingFactor % 1 !== 0) {
      throw new Error(
        'The down sample factor cannot be a decimal. Please make sure that the device sampling rate divided by the down sampled rate produces an integer.'
      );
    }

    this.calcNumOfOutputData();
  }

  /**
   * @returns the down sampling factor
   */
  getDownSamplingFactor() {
    return this.downSamplingFactor;
  }

  getOutput() {
    this.isDataReady = false;
    this.sentOutputData = true;
    return this.outputData;
  }

  getIsDataReady() {
    return this.isDataReady;
  }

  downSampleData(data: Int32Array) {
    if (this.sentOutputData) {
      this.outputData.length = 0;
      this.sentOutputData = false;
    }

    let iData = 0;
    for (let i = 0; i < this.batchSize; i += 1) {
      if (this.count === this.downSamplingFactor) {
        this.outputData.push(
          this.temp.map((value) => value / this.downSamplingFactor)
        );
        this.temp.forEach((_val, index) => (this.temp[index] = 0));
        this.count = 0;

        if (this.numOfOutputData === this.outputData.length) {
          this.isDataReady = true;
        }
      }
      // Separate each data point
      const dataPoint = data.slice(iData, iData + this.elementsPerDP);

      // Average data points
      this.temp.forEach((value, index) => {
        this.temp[index] = value + dataPoint[index];
      });

      iData += this.elementsPerDP;
      this.count++;
    }
  }

  /**
   * Calculated the number of output data point for optimizing performance
   */
  private calcNumOfOutputData() {
    if (this.downSampledRate > 100) {
      this.numOfOutputData = 10;
    }

    if (this.downSampledRate < 100 && this.downSampledRate > 50) {
      this.numOfOutputData = 5;
    }

    if (this.downSampledRate < 50 && this.downSampledRate > 20) {
      this.numOfOutputData = 3;
    }

    if (this.downSampledRate < 20) {
      this.numOfOutputData = 1;
    }
  }
}

export default DownSampler;
