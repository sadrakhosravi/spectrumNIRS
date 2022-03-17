import { IRecordingData } from '@electron/models/RecordingModel';
import V5Calculation from 'calculations/V5/V5Calculation';
import IIRFilter from '../filters/IIRFilters';
import DatabaseOperations from '../main/models/Database/DatabaseOperations';

type CalcDataType = {
  port: MessagePort;
  currentRecording: IRecordingData;
};

const ONE_MS = 1000;
let timeDelta = 10;

let v5Calc: V5Calculation;
const lpFilters = new IIRFilter(5);

type Data = {
  timeData: {
    timeStamp: number;
    timeSequence: number;
  }[];
  data: Uint8Array[];
  byteLength: number;
  batchSize: number;
};

//@ts-ignore
const processData = (data: Data) => {
  for (let i = 0; i < data.batchSize; i += 1) {
    const rawData = DatabaseOperations.parseData(data.data[i] as Buffer);
    const filteredData = lpFilters.filterData(rawData);
    const processedData = v5Calc.processRawData(
      filteredData,
      filteredData.length,
      data.timeData[i].timeSequence,
      timeDelta
    );
    self.postMessage(processedData);
  }
};

self.onmessage = ({ data }: { data: CalcDataType }) => {
  v5Calc = new V5Calculation(data.currentRecording.probeSettings.intensities);
  timeDelta = ONE_MS / 100;
  lpFilters.createLowPassFilters(
    data.currentRecording.probeSettings.samplingRate,
    5,
    6
  );
  const port = data.port;
  data.port.onmessage = ({ data }) => {
    processData(data);

    port.postMessage('done');
  };
};
