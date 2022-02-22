const dbParser = (
  data: Int32Array,
  batchSize: number,
  numOfElementsPerDataPoint: number,
  addTimeDelta: () => number,
  recordingId: number
) => {
  let index = 0;
  const parsedData = new Array(batchSize);
  for (let i = 0; i < batchSize; i += 1) {
    const dataPoint = [];

    for (let j = 0; j < numOfElementsPerDataPoint; j++) {
      dataPoint.push(data[index]);
      index++;
    }

    parsedData[i] = {
      timeStamp: addTimeDelta(),
      PDRawData: dataPoint.slice(0, 6).join(','),
      LEDIntensities: dataPoint.slice(6, 11).join(','),
      gainValues: null,
      events: null,
      event: 0,
      sensor2RawData: null,
      sensor3RawData: null,
      recordingId,
    };
  }
  return parsedData;
};

export default dbParser;
