/*---------------------------------------------------------------------------------------------
 *  Data Manager Model.
 *  Manages the incoming data from the device.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { reaction } from 'mobx';
import { ipcRenderer } from 'electron';
import { ReaderChannels } from '../../utils/channels';

// Types
import type { IReactionDisposer } from 'mobx';
import type { DeviceADCDataType } from '../../renderer/reader/types/DeviceDataType';

// View Models
import { chartVM, barChartVM, deviceManagerVM } from '../../viewmodels/VMStore';

export class DataManagerModel {
  private reactions: IReactionDisposer[];
  private channelName: string;
  constructor() {
    this.reactions = [];
    this.channelName = 'ch1';

    this.init();
  }

  /**
   * Sets the stream's channel number.
   */
  public setChannelSource(channelNum: number) {
    this.channelName = 'ch' + channelNum;
  }

  /**
   * Initializes the class
   */
  private init() {
    this.channelName = 'ch' + deviceManagerVM.activeDevices[0].selectedPD;
    this.handleReactions();
    this.streamDeviceDataToMainChart();
  }

  /**
   * Listens to value changes from other observables
   */
  private handleReactions() {
    const chartViewReactionDisposer = reaction(
      () => chartVM.currentView,
      () => {
        ipcRenderer.removeAllListeners(ReaderChannels.DEVICE_DATA);
        chartVM.currentView === 'line'
          ? this.streamDeviceDataToMainChart()
          : this.streamDeviceDataToCalibration();
      },
    );

    const selectedPDReactionDisposer = reaction(
      () => deviceManagerVM.activeDevices[0].selectedPD,
      () => (this.channelName = 'ch' + deviceManagerVM.activeDevices[0].selectedPD),
    );

    this.reactions.push(chartViewReactionDisposer, selectedPDReactionDisposer);
  }

  /**
   * Listens for parsed data from the reader channel.
   */
  private streamDeviceDataToMainChart() {
    ipcRenderer.on(ReaderChannels.DEVICE_DATA, (_e, dataArr: DeviceADCDataType[]) => {
      requestAnimationFrame(() => {
        dataArr.forEach((data) => {
          const channelData = data[this.channelName];

          for (let i = 0; i < chartVM.charts.length; i++) {
            chartVM.charts[i].series[0].addArrayY(channelData['led' + i]);
          }
        });
      });
    });
  }

  /**
   * Listens for parsed data from the reader channel.
   */
  private streamDeviceDataToCalibration() {
    ipcRenderer.on(ReaderChannels.DEVICE_DATA, (_e, dataArr: DeviceADCDataType[]) => {
      requestAnimationFrame(() => {
        dataArr.forEach((data) => {
          barChartVM?.addData(data);
        });
      });
    });
  }
}

export default new DataManagerModel();
