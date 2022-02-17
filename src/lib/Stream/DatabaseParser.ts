const dbParser = (
  data: Int32Array,
  batchSize: number,
  numOfElementsPerDataPoint: number
) => {
  const parsedData = new Array(batchSize);

  let index = 0;
  for (let i = 0; i < batchSize; i += 1) {
    parsedData[i] = {
      timeStamp: 0,
      PDRawData: data.slice(index, index + 5).join(','),
      LEDIntensities: data.slice(index + 6, index + 11).join(','),
      gainValues: null,
      events: null,
      recordingId: 1,
    };
    index += numOfElementsPerDataPoint;
  }

  return parsedData;
};

export default dbParser;
