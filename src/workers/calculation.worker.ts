//@ts-nocheck
import { DBDataModel } from '@lib/dataTypes/BinaryData';
import V5Calculation from 'calculations/V5/V5Calculation';
import IIRFilter from '../filters/IIRFilters';
import Snappy from 'snappy-electron';

type CalcDataType = {
  port: MessagePort;
  samplingRate: number;
};

const ONE_MS = 1000;
let timeDelta = 10;

//@ts-ignore
const v5Calc = new V5Calculation([120, 141, 123, 120, 169]);

const lpFilters = new IIRFilter(5);

//@ts-ignore
const processData = (data: any) => {
  console.log(data.data.length, data.timeData.length);
  console.time('decoding');

  for (let i = 0; i < data.batchSize; i += 1) {
    //@ts-ignore

    const unCompressedData = Snappy.uncompressSync(data.data[i]) as Buffer;
    const rawData = DBDataModel.fromBuffer(unCompressedData);

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
  timeDelta = ONE_MS / 100;
  lpFilters.createLowPassFilters(data.samplingRate, 5, 6);
  const port = data.port;
  data.port.onmessage = ({ data }) => {
    processData(data);

    port.postMessage('ok');
  };
};
