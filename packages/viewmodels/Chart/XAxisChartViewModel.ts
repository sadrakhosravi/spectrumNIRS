/*---------------------------------------------------------------------------------------------
 *  Charts X Axis View Model.
 *  Uses Mobx observable pattern.
 *  Handles the X axis UI ticks and logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// Model
import { XAxisModel } from '../../models/Chart';

// Types
import type { ChartType } from '../../models/Chart';

export class XAxisChartViewModel {
  /**
   * The X Axis chart model
   */
  private model: XAxisModel;
  constructor() {
    this.model = new XAxisModel();
  }

  public init(containerId: string, attachedChart: ChartType) {
    this.model.init(containerId, attachedChart);
  }
}
