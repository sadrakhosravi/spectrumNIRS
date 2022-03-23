import columnify from 'columnify';
import Export, { SEPARATOR_CHAR } from '../Export';

/**
 * Text export parser
 * @param this Export class
 * @version 0.3.0
 */
async function spacedExport(this: Export) {
  if (!this.writeStream || !this.timeDelta) return;

  const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
  console.log('SPACED EXPORT');

  const calcColumns = ['', 'O2Hb', 'HHb', 'THb', 'TOI'];
  const ADCColumns = [
    'ADC1_Ch1',
    'ADC1_Ch2',
    'ADC1_Ch3',
    'ADC1_Ch4',
    'ADC1_Ch5',
    'Ambient',
  ];

  let firstOutput = this.options.parameterNames === 'Yes' ? true : false;

  const calcDataBatch = this.calc.processRawData(
    this.unPackedData,
    this.unPackedData.length,
    0,
    0
  );
  const dataLength = this.unPackedData.length;

  console.log('Calculated');

  // If this is not true, something has gone wrong here!
  if (dataLength !== calcDataBatch.length) return;

  let count = 0;
  const dataPoints: any[] = [];

  // Loops through all the db data
  for (let i = 0; i < dataLength; i++) {
    const data = this.unPackedData[i];
    const calcData = calcDataBatch[i];

    const dataObj: any = {};

    // Add timeSequence
    dataObj.Time = (this.timeSequence / 1000).toFixed(6); // in seconds

    // Add calculated data
    calcData.forEach((value, ind) => {
      if (ind !== 0) dataObj[calcColumns[ind]] = value.toFixed(12);
    });

    // Add PD raw data
    data.ADC1.forEach((value: number, ind: number) => {
      dataObj[ADCColumns[ind]] = value;
    });

    // Add hardware gain
    dataObj.Gain = 0;

    dataPoints.push(dataObj);
    this.timeSequence += this.timeDelta;
    count++;

    // Write data on specified intervals
    if (count === 100 * 60 * 1) {
      const columns = columnify(dataPoints, {
        showHeaders: firstOutput,
        preserveNewLines: true,
        minWidth: 15,
      });

      // Write to file
      this.writeStream.write(columns + SEPARATOR_CHAR.NEW_LINE);

      firstOutput = false;
      dataPoints.length = 0;
      count = 0;

      await timer(500);
    }
  }

  if (dataPoints.length !== 0) {
    const columns = columnify(dataPoints, {
      showHeaders: firstOutput,
      preserveNewLines: true,
      minWidth: 15,
    });

    // Write to file
    this.writeStream.write(columns + SEPARATOR_CHAR.NEW_LINE);

    firstOutput = false;
    dataPoints.length = 0;
  }

  console.log('Done');
}

export default spacedExport;
