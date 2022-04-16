import ChartModel from '@models/ChartModel';

// Types
import type { Chart } from '/@/charts';

export class ChartController {
  /**
   * Sets the chart dashboard in the observable
   */
  public static setChartInstance(chartInstance: Chart) {
    ChartModel.setChartInstance = chartInstance;
  }
}
