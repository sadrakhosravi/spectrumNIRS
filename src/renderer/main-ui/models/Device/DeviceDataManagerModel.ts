/*---------------------------------------------------------------------------------------------
 *  Device Data Manager Model.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// Models & viewmodels
import { DeviceChartManagerModel } from './DeviceChartManager';
import { appRouterVM, barChartVM, chartVM } from '@viewmodels/VMStore';

// Types
import type { IDisposable } from '../Base/IDisposable';
import type {
  DeviceCalculatedDataType,
  DeviceDataTypeWithMetaData,
} from './api/Types';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

export class DeviceDataManager implements IDisposable {
  /**
   * The device charts manager instance.
   */
  private readonly chartManager: DeviceChartManagerModel;
  private readonly calcChannelNames: string[];
  private readonly sensor: string;

  private startTS: number;
  private selectedPD: number;

  /**
   * The device data handler function.
   */
  public handleData: (_data: DeviceDataTypeWithMetaData[]) => void;

  constructor(
    deviceCharts: DeviceChartManagerModel,
    sensor: 'v5' | 'v6',
    calcChannelNames: string[]
  ) {
    this.chartManager = deviceCharts;
    this.calcChannelNames = calcChannelNames;
    this.sensor = sensor;

    this.startTS = 0;
    this.selectedPD = 1;

    console.log(this.sensor);

    this.handleData = (_data: DeviceDataTypeWithMetaData[]) => {};
  }

  //#region getters

  //#endregion

  //#region setters
  /**
   * Sets the selected PD number data to show.
   */
  public setSelectedPD(PDNumber: number) {
    this.selectedPD = PDNumber;
  }
  //#endregion

  /**
   * Sets the start timestamp of the data to be drawn.
   */
  public start(timestamp: number) {
    console.log('Start');
    this.chartManager.charts.forEach((chart) => {
      chart.series.clearData();
    });
    this.startTS = timestamp;

    // Listen for calibration data
    if (appRouterVM.route === AppNavStatesEnum.CALIBRATION) {
      // Line Graphs
      if (chartVM.currentView === 'line') {
        if (this.sensor === 'v5')
          this.handleData = this.handleDeviceCalibrationDataV5;
        if (this.sensor === 'v6')
          this.handleData = this.handleDeviceCalibrationData;
      }

      // Bar Chart
      if (chartVM.currentView === 'bar') {
        this.handleData = this.handleDeviceIntensityCalibrationData;
      }
    }

    // Listen for calculated data
    if (appRouterVM.route === AppNavStatesEnum.RECORD) {
      if (this.sensor === 'v5')
        this.handleData = this.handleDeviceDataCalculatedV5;

      if (this.sensor === 'v6')
        this.handleData = this.handleDeviceDataCalculated;
    }
  }

  /**
   * Stops the event listeners of the device port.
   */
  public stop() {
    // Remove listeners
  }

  //#region Data Handlers

  private handleDeviceDataCalculatedV5 = (
    data: DeviceDataTypeWithMetaData[]
  ) => {
    requestAnimationFrame(() => {
      for (let i = 0; i < data.length; i++) {
        // Get the current packet timestamp.
        const startTS = data[i].metadata.timestamp - this.startTS;

        // Add the packet to each chart.
        for (let j = 0; j < this.calcChannelNames.length; j++) {
          const channelDataY = (data[i].calcData as DeviceCalculatedDataType)[
            'ADC' + this.selectedPD
          ][this.calcChannelNames[j]];
          this.chartManager.charts[j].series.addArrayY(channelDataY, startTS);
        }
      }
    });
  };

  /**
   * Handles the incoming data from the reader process.
   */
  private handleDeviceDataCalculated = (data: DeviceDataTypeWithMetaData[]) => {
    requestAnimationFrame(() => {
      for (let i = 0; i < data.length; i++) {
        // Get the current packet timestamp.
        const startTS = data[i].metadata.timestamp - this.startTS;

        // Add the packet to each chart.
        for (let j = 0; j < this.calcChannelNames.length; j++) {
          const channelDataY = (data[i].calcData as DeviceCalculatedDataType)[
            'ADC1'
          ][this.calcChannelNames[j]];
          this.chartManager.charts[j].series.addArrayY(channelDataY, startTS);
        }
      }
    });
  };

  /**
   * Handles the incoming data from the reader process.
   */
  private handleDeviceCalibrationData = (
    data: DeviceDataTypeWithMetaData[]
  ) => {
    const selectedPD = this.selectedPD;

    requestAnimationFrame(() => {
      for (let i = 0; i < data.length; i++) {
        // Get the current packet timestamp.
        const startTS = data[i].metadata.timestamp - this.startTS;

        // Add the packet to each chart.
        for (let j = 0; j < this.chartManager.charts.length; j++) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          const channelDataY = data[i].data[('ADC' + selectedPD) as any][
            'ch' + j
          ] as Int32Array;
          this.chartManager.charts[j].series.addArrayY(channelDataY, startTS);
        }
      }
    });
  };

  /**
   * Handles the incoming data from the reader process.
   */
  private handleDeviceCalibrationDataV5 = (
    data: DeviceDataTypeWithMetaData[]
  ) => {
    const selectedPD = this.selectedPD;

    requestAnimationFrame(() => {
      for (let i = 0; i < data.length; i++) {
        // Get the current packet timestamp.
        const startTS = data[i].metadata.timestamp - this.startTS;

        // Ambient
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const channelDataY = data[i].data[('ADC' + selectedPD) as any]
          .ch0 as Int32Array;
        this.chartManager.charts[0].series.addArrayY(channelDataY, startTS);

        // Add the packet to each chart.
        for (let j = 0; j < 5; j++) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          const channelDataY = data[i].data[('ADC' + selectedPD) as any][
            'ch' + (j + 11)
          ] as Int32Array;
          this.chartManager.charts[j + 1].series.addArrayY(
            channelDataY,
            startTS
          );
        }
      }
    });
  };

  /**
   * Handles the device intensity calibration data and sends it to the bar chart
   * to be graphed.
   */
  private handleDeviceIntensityCalibrationData = (
    data: DeviceDataTypeWithMetaData[]
  ) => {
    if (data.length === 0) return;
    const dataPoint: number[] = [];
    const dataPacket = data[data.length - 1];

    for (const ADC in dataPacket.data) {
      const channels = Object.keys((dataPacket.data as any)[ADC]);

      channels.forEach((channel) => {
        const pointPacket = (dataPacket.data as any)[ADC][channel];
        dataPoint.push(pointPacket[pointPacket.length - 1]);
      });
    }
    barChartVM?.addData(dataPoint);
  };

  //#endregion

  /**
   * Disposes the event listeners and observables.
   */
  public dispose(): boolean {
    throw new Error('Method not implemented.');
  }
}
