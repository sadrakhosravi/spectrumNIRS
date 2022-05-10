import { synchronizeAxisIntervals, emptyLine, lightningChart as lcjs } from '@arction/lcjs';

// Modules
import { SortedNumberSet } from '../../utils/structures';
import { DashboardChart } from './DashboardChart';
import { spectrumTheme } from './Theme';

// Types
import type { Dashboard, ChartXY, PointMarker, UIBackground } from '@arction/lcjs';

/**
 * The type of an XY chart.
 */
export type ChartType = ChartXY<PointMarker, UIBackground>;

export class ChartModel {
  /**
   * Total number of rows possible at any given instance of the chart
   */
  private readonly maxRowCount = 21;
  /**
   * A Set of all the available rows in the given instance
   */
  private availableRows: SortedNumberSet;
  /**
   * The LCJS dashboard instance.
   */
  protected dashboard: Dashboard | undefined;

  constructor() {
    this.availableRows = new SortedNumberSet(new Array(30).fill(0).map((_, i) => i));
    this.dashboard = undefined;
  }

  /**
   * @returns the dashboard instance
   */
  public getDashboard() {
    return this.dashboard;
  }

  /**
   * Adds the freed row back to the sorted list.
   * @param rowIndex
   */
  public addFreedRowIndex(rowIndex: number) {
    this.availableRows.addItemToSet(rowIndex);
  }

  /**
   * Creates an instance of a chart in current dashboard
   */
  public addChartXY(): DashboardChart {
    const firstAvailableRow = this.availableRows.getFirstAvailableItem();
    const chart = this.dashboard?.createChartXY({
      columnIndex: 0,
      rowIndex: firstAvailableRow,
      defaultAxisX: undefined,
    }) as ChartType;

    return new DashboardChart(chart, firstAvailableRow);
  }

  /**
   * Creates a dashboard instance of LCJS
   */
  public createDashboard(chartContainerId: string) {
    this.dashboard = lcjs().Dashboard({
      numberOfColumns: 1,
      numberOfRows: this.maxRowCount,
      disableAnimations: true,
      maxFps: 30,
      container: chartContainerId,
      theme: spectrumTheme,
      lineAntiAlias: true,
      antialias: true,
      webgl: {
        version: 'webgl2',
      },
    });
    this.applyDashboardDefaults();
    return this.dashboard;
  }

  /**
   * Synchronizes the X axis interval of the passed in charts array
   */
  public synchronizeChartXAxes(charts: ChartType[]) {
    return synchronizeAxisIntervals(...charts.map((chart) => chart.getDefaultAxisX()));
  }

  /**
   * Applies the default settings to the dashboard instance
   */
  private applyDashboardDefaults() {
    this.dashboard?.setSplitterStyle(emptyLine);
  }

  /**
   * Updates the height of all charts in the dashboard
   */
  public updateChartsHeight(charts: ChartType[]) {
    const totalCharts = charts.length;

    // Set the height of available charts
    for (let row = 0; row < this.maxRowCount; row++) {
      (this.dashboard as Dashboard).setRowHeight(row, 0);
    }

    for (let i = 0; i < totalCharts; i++) {
      (this.dashboard as Dashboard).setRowHeight(i, 1);
    }
  }

  /**
   * Memory cleanup. Required to free the memory properly
   */
  public cleanup() {
    this.dashboard?.dispose();
    this.dashboard = undefined;
  }
}
