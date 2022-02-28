import V5Calculation from 'calculations/V5/V5Calculation';
import IIRFilter from '../filters/IIRFilters';

// Create individual filter object for each channel
const lowpassCh1 = IIRFilter.getLowPassFilter();
const lowpassCh2 = IIRFilter.getLowPassFilter();
const lowpassCh3 = IIRFilter.getLowPassFilter();
const lowpassCh4 = IIRFilter.getLowPassFilter();

/**
 * Filters the data and return the filtered array
 * @param data - the calculated data points to be filtered
 */
const filterData = (data: number[][]) => {
  const dataLength = data.length;
  const filteredData = [];

  for (let i = 0; i < dataLength; i += 1) {
    const dataPoint = data[i]; // [timeStamp, O2Hb, HHb, THb, TOI]
    const filteredDp: number[] = [];

    // Timestamp
    filteredDp.push(dataPoint[0]);

    filteredDp.push(lowpassCh1.singleStep(dataPoint[1]));
    filteredDp.push(lowpassCh2.singleStep(dataPoint[2]));
    filteredDp.push(lowpassCh3.singleStep(dataPoint[3]));
    filteredDp.push(lowpassCh4.singleStep(dataPoint[4]));

    filteredData.push(filteredDp);
  }
  return filteredData;
};

self.onmessage = (event) => {
  console.time('filter');
  const v5Calc = new V5Calculation();
  const processedData = v5Calc.processDbData(event.data);

  const filteredData = filterData(processedData);

  self.postMessage({ calcData: processedData, filteredData: filteredData });
  console.timeEnd('filter');
};
