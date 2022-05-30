/*---------------------------------------------------------------------------------------------
 *  Bar Chart View Model.
 *  Uses Mobx observable pattern.
 *  UI logic for bar chart intensity adjustment.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { BarChartModel } from '../../models/Chart';

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
  }

  /**
   * Adds the ADC data to the chart
   */
  public addData = (data: number[]) => {
    console.log(data);
    this.model.appendData(data);
  };

  /**
   * Disposes the chart.
   */
  public dispose() {
    this.model.dispose();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.model = null;
  }
}
