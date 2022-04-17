import ChartModel from '@models/ChartModel';

// Types
import type { Chart } from '/@/charts';
import type { ChartType } from '/@/charts/types';

export class ChartController {
  /**
   * Sets the chart dashboard in the observable
   */
  public static setChartInstance(chartInstance: Chart) {
    ChartModel.setChartInstance = chartInstance;
  }

  /**
   * Adds the chart to the observable model
   */
  public static addChart(chart: ChartType) {
    ChartModel.addChart = chart;
  }
}
