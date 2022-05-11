/*---------------------------------------------------------------------------------------------
 *  Data Manager Model.
 *  Manages the incoming data from the device.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';
import { ipcRenderer } from 'electron';
import { ReaderChannels } from '../../utils/channels';

// Types
import type { IReactionDisposer } from 'mobx';
import type { DeviceADCDataType } from '../../renderer/reader/types/DeviceDataType';

// View Models
import { chartVM, barChartVM } from '../../viewmodels/VMStore';

export class DataManagerModel {
  @observable private streamTo: 'main' | 'calibration';

  reactions: IReactionDisposer[];
  channelName: string;
  constructor() {
    this.streamTo = 'main';
    this.reactions = [];
    this.channelName = 'ch1';
    this.init();

    makeObservable(this);
  }

  /**
   * Sets the source that the data stream should be sent to.
   */
  @action public setSource(value: 'main' | 'calibration') {
    this.streamTo = value;
    this.handleStreamChange();
  }

  /**
   * Sets the stream's channel number.
   */
  public setChannelSource(channelNum: number) {
    this.channelName = 'ch' + channelNum;
    this.handleStreamChange();
  }

  /**
   * Initializes the class
   */
  private init() {
    this.streamDeviceDataToMainChart();
  }

  /**
   * Handles the streamTo change.
   */
  private handleStreamChange() {
    // Remove all listeners first
    ipcRenderer.removeAllListeners(ReaderChannels.DEVICE_DATA);

    if (this.streamTo === 'main') this.streamDeviceDataToMainChart();
    if (this.streamTo === 'calibration') this.streamDeviceDataToCalibration();
  }

  /**
   * Listens for parsed data from the reader channel.
   */
  private streamDeviceDataToMainChart() {
    ipcRenderer.on(ReaderChannels.DEVICE_DATA, (_e, data: DeviceADCDataType) => {
      const channelData = data[this.channelName];

      for (let i = 0; i < chartVM.charts.length; i++) {
        chartVM.charts[i].series[0].addArrayY(channelData['led' + i]);
      }
    });
  }

  /**
   * Listens for parsed data from the reader channel.
   */
  private streamDeviceDataToCalibration() {
    ipcRenderer.on(ReaderChannels.DEVICE_DATA, (_e, data: DeviceADCDataType) => {
      barChartVM?.addData(data);
    });
  }
}

export default new DataManagerModel();
