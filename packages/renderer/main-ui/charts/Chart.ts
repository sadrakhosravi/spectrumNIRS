import { ChartBase } from './ChartBase';

// Types

// Debugging

export class Chart extends ChartBase {
  private containerId: string;

  constructor(_containerId: string) {
    super();

    this.containerId = _containerId;

    this.createDashboard(this.containerId);
    this.addChartXY();
    this.addChartXY();
    this.addChartXY();
    this.addChartXY();
    this.addChartXY();
    this.addChartXY();
  }
}
