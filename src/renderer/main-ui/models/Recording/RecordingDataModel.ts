/*---------------------------------------------------------------------------------------------
 *  Recording Data Model.
 *  Handles the recording's data.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import ServiceManager from '@services/ServiceManager';
import Snappy from 'snappy';
import { deserialize } from 'v8';
import { IReactionDisposer, reaction } from 'mobx';
import { IDisposable } from '../Base/IDisposable';

// Beast Parser
import type { DeviceDataTypeWithMetaData } from '../Device/api/Types';

// Calculation
import BeastNIRSCalculation from '../Device/Modules/Beast/calculation/BeastNIRSCalculations';

// View Models
import { appRouterVM, chartVM, filterSettingsVM } from '/@/viewmodels/VMStore';

// Types
import type { RecordingDataType } from '/@/workers/database/Queries/RecordingQueries';

export type DataUnpacked = {
  Beast: {
    data: Buffer;
    metadata: DeviceDataTypeWithMetaData['metadata'];
  }[];
};

export type DataModelType = {
  ADC1: {
    ch0: number[];
    ch1: number[];
    ch2: number[];
    ch3: number[];
    ch4: number[];
    ch5: number[];
    ch6: number[];
    ch7: number[];
    ch8: number[];
  };
  ADC2: {
    ch0: number[];
    ch1: number[];
    ch2: number[];
    ch3: number[];
    ch4: number[];
    ch5: number[];
    ch6: number[];
    ch7: number[];
    ch8: number[];
  };
  calcData: {
    ADC1: { O2Hb: number[]; HHb: number[]; THb: number[]; TOI: number[] };
    ADC2: { O2Hb: number[]; HHb: number[]; THb: number[]; TOI: number[] };
  };
};

export class RecordingDataModel implements IDisposable {
  /**
   * The recording id to get the data from.
   */
  protected readonly recordingId: number;
  data: {
    ADC1: {
      ch0: number[];
      ch1: number[];
      ch2: number[];
      ch3: number[];
      ch4: number[];
      ch5: number[];
      ch6: number[];
      ch7: number[];
      ch8: number[];
    };
    ADC2: {
      ch0: number[];
      ch1: number[];
      ch2: number[];
      ch3: number[];
      ch4: number[];
      ch5: number[];
      ch6: number[];
      ch7: number[];
      ch8: number[];
    };
    calcData: { O2Hb: number[]; HHb: number[]; THb: number[]; TOI: number[] };
    calcData2: { O2Hb: number[]; HHb: number[]; THb: number[]; TOI: number[] };
  };
  private readonly reactions: IReactionDisposer[];
  constructor(recordingId: number) {
    this.recordingId = recordingId;

    this.data = {
      ADC1: {
        ch0: [],
        ch1: [],
        ch2: [],
        ch3: [],
        ch4: [],
        ch5: [],
        ch6: [],
        ch7: [],
        ch8: [],
      },
      ADC2: {
        ch0: [],
        ch1: [],
        ch2: [],
        ch3: [],
        ch4: [],
        ch5: [],
        ch6: [],
        ch7: [],
        ch8: [],
      },
      calcData: {
        O2Hb: [],
        HHb: [],
        THb: [],
        TOI: [],
      },
      calcData2: {
        O2Hb: [],
        HHb: [],
        THb: [],
        TOI: [],
      },
    };
    this.reactions = [];
    this.handleFilters();
  }

  /**
   * Loads the data of the recording in to memory.
   */
  public async loadData() {
    appRouterVM.setAppLoading(true, false, 'Loading Data...');
    console.time('data');

    const recording =
      await ServiceManager.dbConnection.recordingQueries.selectRecording(
        this.recordingId
      );
    const deviceInfo = recording.devices[0].settings;

    // Calculate the data.
    const calc = new BeastNIRSCalculation();
    calc.init(deviceInfo);

    if (recording.sensor === 'v5') {
      calc.setSensorType('v5');
    }

    if (recording.sensor === 'v6') {
      calc.setSensorType('v6');
    }

    const LIMIT = 500;
    let offset = 0;

    // Loop over all recordings
    while (true) {
      const data =
        // eslint-disable-next-line no-await-in-loop
        await ServiceManager.dbConnection.recordingQueries.selectRecordingData(
          this.recordingId,
          LIMIT,
          offset
        );

      if (data.length === 0) break;

      // Process data
      const dataLength = data.length;

      // Porcess V5 data
      if (recording.sensor === 'v5') {
        this.processV5Data(data, dataLength, calc);
        const step = 1000 / deviceInfo.samplingRate;

        chartVM.charts[0].series[0].series.addArrayY(
          this.data.calcData.O2Hb,
          step
        );
        chartVM.charts[1].series[0].series.addArrayY(
          this.data.calcData.HHb,
          step
        );
        chartVM.charts[2].series[0].series.addArrayY(
          this.data.calcData.THb,
          step
        );
        chartVM.charts[3].series[0].series.addArrayY(
          this.data.calcData.TOI,
          step
        );
      }

      // Process V6 data.
      if (recording.sensor === 'v6') {
        this.processV6Data(data, dataLength, calc);
        const step = 1000 / deviceInfo.samplingRate;

        chartVM.charts[0].series[0].series.addArrayY(
          this.data.calcData.O2Hb,
          step
        );
        chartVM.charts[1].series[0].series.addArrayY(
          this.data.calcData.HHb,
          step
        );
        chartVM.charts[2].series[0].series.addArrayY(
          this.data.calcData.THb,
          step
        );
        chartVM.charts[3].series[0].series.addArrayY(
          this.data.calcData.TOI,
          step
        );
      }

      // Increments
      offset += LIMIT;

      //@ts-ignore
      global.gc();
    }

    setTimeout(() => {
      appRouterVM.setAppLoading(false);
    }, 100);
  }

  /**
   * Processes V5 sensor data.
   */
  private processV5Data(
    data: RecordingDataType[],
    dataLength: number,
    calc: BeastNIRSCalculation
  ) {
    // Loop over all the data.
    for (let i = 0; i < dataLength; i++) {
      const decompressed = Snappy.uncompressSync(data[i].data) as Buffer;
      const dataUnpacked: any = deserialize(decompressed) as DataUnpacked;

      calc.setBatchSize(dataUnpacked.Beast.ADC1.ch0.length);
      const calcData = calc.processDataV5(dataUnpacked.Beast);

      // Raw values
      this.data.ADC1.ch0.push(...dataUnpacked.Beast.ADC1.ch0);
      //@ts-ignore
      this.data.ADC1.ch1.push(...dataUnpacked.Beast.ADC1.ch1);
      //@ts-ignore
      this.data.ADC1.ch2.push(...dataUnpacked.Beast.ADC1.ch2);
      //@ts-ignore
      this.data.ADC1.ch3.push(...dataUnpacked.Beast.ADC1.ch3);
      //@ts-ignore
      this.data.ADC1.ch4.push(...dataUnpacked.Beast.ADC1.ch4);
      //@ts-ignore
      this.data.ADC1.ch5.push(...dataUnpacked.Beast.ADC1.ch5);

      // Calculated data.
      this.data.calcData.O2Hb.push(...calcData.ADC1.O2Hb);
      this.data.calcData.HHb.push(...calcData.ADC1.HHb);
      this.data.calcData.THb.push(...calcData.ADC1.THb);
      this.data.calcData.TOI.push(...calcData.ADC1.TOI);
    }
  }

  /**
   * Processes V5 sensor data.
   */
  private processV6Data(
    data: RecordingDataType[],
    dataLength: number,
    calc: BeastNIRSCalculation
  ) {
    // Loop over all the data.
    for (let i = 0; i < dataLength; i++) {
      const decompressed = Snappy.uncompressSync(data[i].data) as Buffer;
      const dataUnpacked: any = deserialize(decompressed) as DataUnpacked;

      calc.setBatchSize(dataUnpacked.Beast.ADC1.ch0.length);
      const calcData = calc.processData(dataUnpacked.Beast);

      // Raw values
      // ADC1
      this.data.ADC1.ch0.push(...dataUnpacked.Beast.ADC1.ch0);
      //@ts-ignore
      this.data.ADC1.ch1.push(...dataUnpacked.Beast.ADC1.ch1);
      //@ts-ignore
      this.data.ADC1.ch2.push(...dataUnpacked.Beast.ADC1.ch2);
      //@ts-ignore
      this.data.ADC1.ch3.push(...dataUnpacked.Beast.ADC1.ch3);
      //@ts-ignore
      this.data.ADC1.ch4.push(...dataUnpacked.Beast.ADC1.ch4);
      //@ts-ignore
      this.data.ADC1.ch5.push(...dataUnpacked.Beast.ADC1.ch5);
      //@ts-ignore
      this.data.ADC1.ch6.push(...dataUnpacked.Beast.ADC1.ch6);
      //@ts-ignore
      this.data.ADC1.ch7.push(...dataUnpacked.Beast.ADC1.ch7);
      //@ts-ignore
      this.data.ADC1.ch8.push(...dataUnpacked.Beast.ADC1.ch8);

      // ADC2
      this.data.ADC2.ch0.push(...dataUnpacked.Beast.ADC1.ch0);
      //@ts-ignore
      this.data.ADC2.ch1.push(...dataUnpacked.Beast.ADC1.ch1);
      //@ts-ignore
      this.data.ADC2.ch2.push(...dataUnpacked.Beast.ADC1.ch2);
      //@ts-ignore
      this.data.ADC2.ch3.push(...dataUnpacked.Beast.ADC1.ch3);
      //@ts-ignore
      this.data.ADC2.ch4.push(...dataUnpacked.Beast.ADC1.ch4);
      //@ts-ignore
      this.data.ADC2.ch5.push(...dataUnpacked.Beast.ADC1.ch5);
      //@ts-ignore
      this.data.ADC2.ch6.push(...dataUnpacked.Beast.ADC1.ch6);
      //@ts-ignore
      this.data.ADC2.ch7.push(...dataUnpacked.Beast.ADC1.ch7);
      //@ts-ignore
      this.data.ADC2.ch8.push(...dataUnpacked.Beast.ADC1.ch8);

      // Calculated data.
      // ADC1
      this.data.calcData.O2Hb.push(...calcData.ADC1.O2Hb);
      this.data.calcData.HHb.push(...calcData.ADC1.HHb);
      this.data.calcData.THb.push(...calcData.ADC1.THb);
      this.data.calcData.TOI.push(...calcData.ADC1.TOI);

      // ADC2
      this.data.calcData2.O2Hb.push(...calcData.ADC2.O2Hb);
      this.data.calcData2.HHb.push(...calcData.ADC2.HHb);
      this.data.calcData2.THb.push(...calcData.ADC2.THb);
      this.data.calcData2.TOI.push(...calcData.ADC2.TOI);
    }
  }

  /**
   * Reacts to filter changes and redraws the data
   */
  private handleFilters() {
    this.reactions.push(
      reaction(
        () => filterSettingsVM.isActive,
        (currValue) => this.handleFilterChange(currValue)
      ),
      reaction(
        () => filterSettingsVM.cutoffFrequency,
        () => this.handleFilterChange(true)
      ),
      reaction(
        () => filterSettingsVM.order,
        () => this.handleFilterChange(true)
      )
    );
  }

  /**
   * Listens for filter change and applies the filter on the data.
   */
  private handleFilterChange(currValue: boolean) {
    const calcDataKeys: string[] = Object.keys(this.data.calcData);

    if (currValue) {
      chartVM.charts.forEach((chart, i) => {
        chart.series[0].clearData();

        chart.series[0].addArrayYOnly(
          //@ts-ignore
          this.data.calcData[calcDataKeys[i] as any]
        );
      });
    }

    if (!currValue) {
      chartVM.charts.forEach((chart, i) => {
        chart.series[0].clearData();

        chart.series[0].addArrayYOnly(
          //@ts-ignore
          this.data.calcData[calcDataKeys[i] as any]
        );
      });
    }

    setTimeout(
      () =>
        //@ts-ignore
        global.gc(),
      1000
    );
  }

  /**
   * Disposes event listeners and resources.
   */
  public dispose(): boolean {
    this.reactions.forEach((disposer) => disposer());
    return true;
  }
}
