/*---------------------------------------------------------------------------------------------
 *  Bar Chart View Model.
 *  Uses Mobx observable pattern.
 *  UI logic for bar chart intensity adjustment.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { ipcRenderer } from 'electron';
import { BarChartModel } from '../../models/Chart';

// Types
import type { DeviceADCDataType } from '../../renderer/reader/types/DeviceDataType';
import { ReaderChannels } from '../../utils/channels';

// View Models
import { deviceManagerVM } from '../VMStore';

export class BarChartViewModel {
  /**
   * The bar chart model instance.
   */
  private model: BarChartModel;

  constructor() {
    this.model = new BarChartModel();
  }

  /**
   * Initializes the model and the view model.
   */
  public init(containerId: string) {
    this.model.init(containerId);
    this.model.addLEDs(deviceManagerVM.activeDevices[0].LEDs.length);
    this.listenForADCData();
  }

  /**
   * Adds the ADC data to the chart
   */
  public addData(data: DeviceADCDataType) {
    const ADCData = data[`ch${deviceManagerVM.activeDevices[0].selectedPD}`];
    this.model.addData(ADCData);
  }

  /**
   * Listen for IPC data from the reader.
   */
  private listenForADCData() {
    ipcRenderer.on(ReaderChannels.DEVICE_DATA, (_event, data: DeviceADCDataType) => {
      this.addData(data);
    });
  }

  /**
   * Disposes the chart.
   */
  public dispose() {
    // Remove IPC listeners
    ipcRenderer.removeAllListeners(ReaderChannels.DEVICE_DATA);

    this.model.dispose();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.model = null;
  }
}
