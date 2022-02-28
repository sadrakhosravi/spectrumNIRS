export interface DBData {
  timeStamp: number;
  PDRawData: number[];
  LEDIntensities: number[];
  gainValues: string | null;
  events: string | null;
  event: 0 | 1;
  sensor2RawData: string | null;
  sensor3RawData: string | null;
  recordingId: number;
}

const prepareDbData = (
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

const dbParser = (dbData: DBData[]) => {
  const dbDataLength = dbData.length;

  for (let i = 0; i < dbDataLength; i += 1) {
    //@ts-ignore
    dbData[i].PDRawData = dbData[i].PDRawData.split(',').map((val) => ~~val);
    //@ts-ignore
    dbData[i].LEDIntensities = dbData[i].LEDIntensities.split(',').map(
      (val: any) => ~~val
    );
  }

  return dbData;
};

export { prepareDbData, dbParser };
