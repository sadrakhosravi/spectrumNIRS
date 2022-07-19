/*---------------------------------------------------------------------------------------------
 *  Recording Data Model.
 *  Handles the recording's data.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import ServiceManager from '@services/ServiceManager';
import Snappy from 'snappy';
import { deserialize } from 'v8';

// Beast Parser
import { BeastParser } from '../Device/Modules/Beast/BeastParser';
import type { DeviceDataTypeWithMetaData } from '../Device/api/Types';

// Calculation
import BeastNIRSCalculation from '../Device/Modules/Beast/calculation/BeastNIRSCalculations';
import { appRouterVM, chartVM, filterSettingsVM } from '/@/viewmodels/VMStore';
import { IReactionDisposer, reaction } from 'mobx';
import { IDisposable } from '../Base/IDisposable';

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
  };
  calcData: { O2Hb: number[]; HHb: number[]; THb: number[]; TOI: number[] };
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
    };
    calcData: { O2Hb: number[]; HHb: number[]; THb: number[]; TOI: number[] };
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
      },
      calcData: {
        O2Hb: [],
        HHb: [],
        THb: [],
        TOI: [],
      },
    };
    this.reactions = [];
    this.handleFilters();
  }
  dispose(): boolean {
    this.reactions.forEach((disposer) => disposer());
    return true;
  }

  /**
   * Loads the data of the recording in to memory.
   */
  public async loadData() {
    appRouterVM.setAppLoading(false);

    requestAnimationFrame(() =>
      appRouterVM.setAppLoading(true, false, 'Loading Recording Data')
    );

    const deviceInfo = (
      await ServiceManager.dbConnection.recordingQueries.selectRecording(
        this.recordingId
      )
    ).devices[0].settings;

    const data =
      await ServiceManager.dbConnection.recordingQueries.selectRecordingData(
        this.recordingId,
        500
      );

    const dataLength = data.length;
    const parser = new BeastParser();
    const calc = new BeastNIRSCalculation();

    calc.init(deviceInfo);

    // Loop over all the data.
    for (let i = 0; i < dataLength; i++) {
      const decompressed = Snappy.uncompressSync(data[i].data) as Buffer;
      const dataUnpacked: any = deserialize(decompressed) as DataUnpacked;

      const dataPacketsLength = dataUnpacked.Beast.length;

      // Loop over each packet.
      for (let j = 0; j < dataPacketsLength; j++) {
        const packet = dataUnpacked.Beast[j];
        const parsedData = parser.processPacket(
          packet.data
        ) as DeviceDataTypeWithMetaData;

        const calcData = calc.processData(parsedData.data);

        // Raw values
        this.data.ADC1.ch0.push(...parsedData.data.ADC1.ch0);
        //@ts-ignore
        this.data.ADC1.ch1.push(...parsedData.data.ADC1.ch11);
        //@ts-ignore
        this.data.ADC1.ch2.push(...parsedData.data.ADC1.ch12);
        //@ts-ignore
        this.data.ADC1.ch3.push(...parsedData.data.ADC1.ch13);
        //@ts-ignore
        this.data.ADC1.ch4.push(...parsedData.data.ADC1.ch14);
        //@ts-ignore
        this.data.ADC1.ch5.push(...parsedData.data.ADC1.ch15);

        // Calculated data.
        this.data.calcData.O2Hb.push(...calcData.ADC1.O2Hb);
        this.data.calcData.HHb.push(...calcData.ADC1.HHb);
        this.data.calcData.THb.push(...calcData.ADC1.THb);
        this.data.calcData.TOI.push(...calcData.ADC1.TOI);
      }
    }

    //@ts-ignore
    global.gc();

    // Plot the data
    requestAnimationFrame(() => {
      console.time('appendData');
      chartVM.charts[0].series[0].series.addArrayY(this.data.calcData['O2Hb']);
      chartVM.charts[1].series[0].series.addArrayY(this.data.calcData['HHb']);
      chartVM.charts[2].series[0].series.addArrayY(this.data.calcData['THb']);
      chartVM.charts[3].series[0].series.addArrayY(this.data.calcData['TOI']);
      console.timeEnd('appendData');

      setTimeout(() => {
        appRouterVM.setAppLoading(false);
      }, 100);
    });

    setTimeout(() => {
      //@ts-ignore
      global.gc();
    }, 3000);
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
  }
}
