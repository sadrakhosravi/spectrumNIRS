import Export, { SEPARATOR_CHAR } from '../Export';

/**
 * CSV export parser
 * @param this Export class
 * @version 0.3.0
 */
async function commaExport(this: Export) {
  if (!this.writeStream || !this.timeDelta) return;
  const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const columnTitles = [
    'Time(s)',
    'O2Hb',
    'HHb',
    'THb',
    'TOI',
    'ADC1_CH1',
    'ADC1_CH2',
    'ADC1_CH3',
    'ADC1_CH4',
    'ADC1_CH5',
    'Ambient',
    'Gain',
    'Events',
  ];

  // Add column title
  if (this.options.parameterNames === 'Yes') {
    this.writeStream.write(
      columnTitles.join(this.separator) + SEPARATOR_CHAR.NEW_LINE
    );
  }

  const calcDataBatch = this.calc.processRawData(
    this.unPackedData,
    this.unPackedData.length,
    0,
    0
  );

  const dataLength = this.unPackedData.length;

  // If this is not true, something has gone wrong here!
  if (dataLength !== calcDataBatch.length) return;

  const dataPoint: any[] = [];
  const dataBatch: any[] = [];

  let count = 0;

  // Loops through all the db data
  for (let i = 0; i < dataLength; i++) {
    const data = this.unPackedData[i];
    const calcData = calcDataBatch[i];

    // Add timeSequence
    dataPoint.push((this.timeSequence / 1000).toFixed(4));

    // Add calculated data
    calcData.forEach((value, ind) => ind !== 0 && dataPoint.push(value));

    // Add PD raw data
    data.ADC1.forEach((pdValue: number) => dataPoint.push(pdValue));

    // Add hardware gain
    dataPoint.push(0);

    // Add events
    dataPoint.push('');

    dataBatch.push(dataPoint.join(','));
    dataPoint.length = 0;

    count++;

    if (count === 100 * 60 * 1) {
      this.writeStream.write(dataBatch.join('\n'));
      dataBatch.length = 0;
      count = 0;

      await timer(300);
    }

    this.timeSequence += this.timeDelta;
  }

  this.writeStream.write(dataBatch.join('\n'));
  dataBatch.length = 0;
  count = 0;
}

export default commaExport;
