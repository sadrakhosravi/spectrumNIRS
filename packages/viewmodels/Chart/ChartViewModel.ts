/*---------------------------------------------------------------------------------------------
 *  ChartViewModel View Model.
 *  Uses Mobx observable pattern.
 *  Manages the chart instance
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { action, makeObservable, observable, reaction, computed } from 'mobx';

// Models
import { ChartModel, ChartChannel } from '../../models/Chart';
import { ColorPalette } from '../../models/ColorPalette';

// Types
import type { ChartSeries, DashboardChart } from '../../models/Chart';
import type { Dashboard, SynchronizeAxisIntervalsHandle } from '@arction/lcjs';
import type { CSSProperties } from 'react';

export type IChart = {
  dashboardChart: DashboardChart;
  series: ChartSeries[];
  channel: ChartChannel;
  id: string;
};

export class ChartViewModel {
  /**
   * The chart model instance
   */
  private model: ChartModel;
  /**
   * The charts of the dashboard
   */
  @observable public charts: IChart[];
  /**
   * The CSS style of the chart container div element
   */
  @observable public chartContainerStyle: CSSProperties = { height: '100%' };
  /**
   * The CSS style of the parent container div element
   */
  @observable public parentContainerStyle: CSSProperties = { overflow: 'hidden' };
  /**
   * A color palette model with available colors
   */
  colors: ColorPalette;
  /**
   * The handler function for synchronized X axis of all charts
   */
  xAxisSynchronizedHandler: SynchronizeAxisIntervalsHandle | null;
  /**
   * Whether a channels is maximized in the dashboard
   */
  @observable private isChannelMaximized: boolean;
  /**
   * The height of the dashboard
   */
  private dashboardHeight: string;

  constructor() {
    this.model = new ChartModel();
    this.charts = [];
    this.colors = new ColorPalette();
    this.xAxisSynchronizedHandler = null;
    this.isChannelMaximized = false;
    this.dashboardHeight = '100%';
    // Make this class observable
    makeObservable(this);
    this.reactions();
  }

  /**
   * @returns the total number of charts in the current dashboard instance.
   */
  @computed get totalCharts() {
    return this.charts.length;
  }

  /**
   * Creates the dashboard instance.
   */
  public init(containerId: string) {
    if (!this.model.getDashboard()) this.model.createDashboard(containerId);
    this.addCharts();
    this.addCharts();
    this.addCharts();
    this.addCharts();
    this.addCharts();
    this.addCharts();
    this.addCharts();
    this.addCharts();
    this.addCharts();
    this.addCharts();
  }

  /**
   * @returns the current LCJS dashboard instance
   */
  public getDashboard() {
    return this.model.getDashboard();
  }

  /**
   * Adds a new chart to the dashboard instance.
   */
  @action public addCharts() {
    const chart = this.model.addChartXY();
    this.charts.push({
      dashboardChart: chart,
      channel: new ChartChannel(chart.chart),
      id: chart.getId(),
      series: [],
    });
  }

  /**
   * Adds a new series to the given chart object
   */
  @action public addSeries(chartId: string, seriesName: string, seriesColor?: string) {
    const chart = this.charts.find((chart) => chart.dashboardChart.getId() === chartId);

    // If the chart was not found, something has gone wrong
    if (!chart) throw new Error('The chart was not found! Try again');

    // If no colors, randomly generate one from the color palette.
    let color = seriesColor;
    if (!color) {
      color = this.colors.getNextColor();
    }

    const series = chart.dashboardChart.addLineSeries(seriesName || 'No Name', color || '#fff');
    chart.series.push(series);
  }

  /**
   * Maximizes the given chart in the dashboard.
   * @param maximizedChartId the of the chart to maximize
   */
  @action public maximizeChannel(maximizedChartId: string) {
    this.isChannelMaximized = true;
    const dashboard = this.model.getDashboard() as Dashboard;
    const maximizedChartIndex = this.charts.findIndex(
      (chart) => chart.id === maximizedChartId,
    ) as number;

    for (let i = 0; i < this.charts.length; i++) {
      if (i === maximizedChartIndex) {
        continue;
      }
      const chart = this.charts[i].dashboardChart;
      chart.hideAxes();
      dashboard.setRowHeight(i, 0.0001);
    }
  }

  /**
   * Resets all channel heights back to the default uniform height
   */
  @action public resetChannelHeights() {
    this.isChannelMaximized = false;
    const dashboard = this.model.getDashboard() as Dashboard;

    for (let i = 0; i < this.charts.length; i++) {
      const chart = this.charts[i].dashboardChart;
      chart.showAxes();

      dashboard.setRowHeight(i, 1);
    }
  }

  /**
   * Cleanups the chart listeners and disposes the dashboard
   */
  public dispose() {
    this.charts.forEach((chart) => {
      chart.series.forEach((series) => series.series.dispose());
      chart.dashboardChart.chart.dispose();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      chart = null;
    });
    this.model.cleanup();
  }

  /**
   * Reacts to changes in certain observables
   */
  private reactions() {
    // On chart addition or deletion
    reaction(
      () => this.charts.length,
      () => {
        const totalCharts = this.charts.length;

        // Update chart heights
        this.model.updateChartsHeight(this.charts.map((chart) => chart.dashboardChart.chart));

        // Sync X axis intervals
        // First remove the existing one
        if (this.xAxisSynchronizedHandler) {
          this.xAxisSynchronizedHandler.remove();
          this.xAxisSynchronizedHandler = null;
        }
        this.xAxisSynchronizedHandler = this.model.synchronizeChartXAxes(
          this.charts.map((chart) => chart.dashboardChart.chart),
        );

        // Set the style of the chart and parent div containers
        if (totalCharts > 12) {
          const diff = (totalCharts - 12) * 100; // 150px for each chart;
          this.chartContainerStyle = { height: `calc(100% + ${diff}px)` };
          this.dashboardHeight = `calc(100% + ${diff}px)`;
          this.parentContainerStyle = { overflow: 'auto' };
        }
        if (totalCharts < 12) {
          this.chartContainerStyle = { height: '100%' };
          this.dashboardHeight = '100%';
          this.parentContainerStyle = { overflow: 'hidden' };
        }
      },
    );

    // Channel Maximize reaction
    reaction(
      () => this.isChannelMaximized,
      () => {
        if (this.isChannelMaximized) {
          this.chartContainerStyle = { height: '100%' };
          this.parentContainerStyle = { overflow: 'hidden' };
        } else {
          this.chartContainerStyle = { height: this.dashboardHeight };
          this.parentContainerStyle = { overflow: this.charts.length > 12 ? 'auto' : 'hidden' };
        }
      },
    );
  }
}

export default ChartViewModel;
