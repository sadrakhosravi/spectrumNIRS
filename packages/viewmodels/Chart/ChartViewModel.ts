/*---------------------------------------------------------------------------------------------
 *  ChartViewModel View Model.
 *  Uses Mobx observable pattern.
 *  Manages the chart instance
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { action, makeObservable, observable, reaction, computed } from 'mobx';
import { ipcRenderer } from 'electron';
import ReaderChannels from '../../utils/channels/ReaderChannels';

// Models
import { ChartModel } from '../../models/Chart';
import { ColorPalette } from '../../models/ColorPalette';

// Types
import type { ChartSeries, DashboardChart } from '../../models/Chart';
import type { Dashboard, SynchronizeAxisIntervalsHandle } from '@arction/lcjs';
import type { CSSProperties } from 'react';
import type { IReactionDisposer } from 'mobx';

export type IChart = {
  dashboardChart: DashboardChart;
  series: ChartSeries[];
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
  private colors: ColorPalette;
  /**
   * The handler function for synchronized X axis of all charts
   */
  private xAxisSynchronizedHandler: SynchronizeAxisIntervalsHandle | null;
  /**
   * Whether a channels is maximized in the dashboard
   */
  @observable public isChannelMaximized: string | null;
  /**
   * The height of the X Axis for all charts
   */
  public readonly xAxisHeight: '40px';
  /**
   * The height of the dashboard
   */
  private dashboardHeight: string;
  /**
   * An array of all the reaction functions for later dispose
   */
  private reactions: IReactionDisposer[];
  /**
   * The current chart view.
   */
  @observable private currView: 'line' | 'bar';

  constructor() {
    this.model = new ChartModel();
    this.charts = [];
    this.colors = new ColorPalette();
    this.xAxisSynchronizedHandler = null;
    this.isChannelMaximized = null;
    this.xAxisHeight = '40px';
    this.dashboardHeight = `calc(100% - ${this.xAxisHeight})`;
    this.currView = 'line';
    // Make this class observable
    makeObservable(this);
    this.reactions = [];
    this.handleReactions();
  }

  /**
   * @returns the total number of charts in the current dashboard instance.
   */
  @computed get totalCharts() {
    return this.charts.length;
  }

  /**
   * The current chart view/
   */
  public get currentView() {
    return this.currView;
  }

  /**
   * Creates the dashboard instance.
   */
  public init(containerId: string) {
    if (!this.model.getDashboard()) this.model.createDashboard(containerId);
  }

  /**
   * @returns the current LCJS dashboard instance
   */
  public getDashboard() {
    return this.model.getDashboard();
  }

  /**
   * Sets the current chart view
   */
  @action public setCurrentView(value: 'line' | 'bar') {
    this.currView = value;
  }

  /**
   * Adds a new chart to the dashboard instance.
   * @returns the chart id
   */
  @action public addChart() {
    console.log('ADD CHART');
    // If the first chart does not have a series, nothing was added before
    if (this.charts.length === 1 && this.charts[0].series.length === 0)
      return this.charts[0].dashboardChart;

    const chart = this.model.addChartXY();
    const chartId = chart.getId();
    this.charts.push({
      dashboardChart: chart,
      id: chartId,
      series: [],
    });

    return chart;
  }

  /**
   * Removes the chart and all its belongings from the observable list.
   */
  @action public removeChart(chartId: string) {
    const chartIndex = this.charts.findIndex((chart) => chart.id === chartId);
    if (chartIndex === -1) return;

    if (chartIndex === 0) {
      this.removeSeries(chartIndex);
      return;
    }

    // Remove the chart and its series
    this.removeChartAndSeries(chartIndex);

    // Remove the object from observable
    this.charts.splice(chartIndex, 1);
  }

  /**
   * Removes the last chart from the observable if charts are more than 1.
   */
  @action public removeLastChart() {
    // Dont remove the last chart for x axis synchronization
    if (this.charts.length === 1) {
      this.removeSeries(0);
      return;
    }

    // Remove the chart and series
    const lastChartIndex = this.charts.length - 1;
    this.removeChartAndSeries(lastChartIndex);

    // Remove the object from observable
    this.charts.splice(lastChartIndex, 1);
  }

  /**
   * Cleans up the chart and its series and remove the axis synchronization.
   */
  @action private removeChartAndSeries(chartIndex: number) {
    if (chartIndex === -1) return;

    // Remove the synchronization first.
    this.removeAxisSynchronization();

    this.charts[chartIndex].series.forEach((series) => series.dispose());
    this.charts[chartIndex].series.length = 0;
    const rowIndexFreed = this.charts[chartIndex].dashboardChart.dispose();

    this.model.addFreedRowIndex(rowIndexFreed);
  }

  /**
   * Disposes the chart series and removes its reference from the observable.
   */
  @action private removeSeries(chartIndex: number) {
    this.charts[chartIndex].series.forEach((series) => series.dispose());
    this.charts[chartIndex].series.length = 0;
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
      color = this.colors.getNextColor(chart.dashboardChart.getChartRowIndex());
    }

    const series = chart.dashboardChart.addLineSeries(seriesName || 'No Name', color || '#fff');
    chart.series.push(series);

    return series;
  }

  /**
   * Maximizes the given chart in the dashboard.
   * @param maximizedChartId the of the chart to maximize
   */
  @action public maximizeChannel(maximizedChartId: string) {
    this.isChannelMaximized = maximizedChartId;
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
    this.isChannelMaximized = null;
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
  @action public dispose() {
    ipcRenderer.removeAllListeners(ReaderChannels.DEVICE_DATA);

    this.reactions.forEach((reaction) => reaction());
    this.reactions.length = 0;

    this.xAxisSynchronizedHandler?.remove();

    this.charts.forEach((chart) => {
      chart.series.forEach((series) => series.dispose());
      chart.series.length = 0;
      chart.dashboardChart.dispose();
    });

    this.charts.length = 0;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.charts = null;
    this.model.cleanup();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.model = null;
  }

  /**
   * Removes the X axis synchronize handler
   */
  private removeAxisSynchronization() {
    this.xAxisSynchronizedHandler?.remove();
    this.xAxisSynchronizedHandler = null;
  }

  /**
   * Reacts to changes in certain observables
   */
  private handleReactions() {
    // On chart addition or deletion
    const chartLengthReaction = reaction(
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

        // Set new charts interval first
        const interval = this.charts[0].dashboardChart.chart.getDefaultAxisX().getInterval();
        const allCharts = this.charts.map((chart) => {
          chart.dashboardChart.chart.getDefaultAxisX().setInterval(interval.start, interval.end);
          return chart.dashboardChart.chart;
        });

        this.xAxisSynchronizedHandler = this.model.synchronizeChartXAxes(allCharts);

        // Set the style of the chart and parent div containers
        if (totalCharts > 12) {
          const diff = (totalCharts - 12) * 150; // 150px for each chart;
          this.chartContainerStyle = { height: `calc(100% + ${diff}px)` };
          this.dashboardHeight = `calc(100% + ${diff}px)`;
          this.parentContainerStyle = { overflowY: 'auto', overflowX: 'hidden' };
        }
        if (totalCharts < 12) {
          this.chartContainerStyle = { height: '100%' };
          this.dashboardHeight = '100%';
          this.parentContainerStyle = { overflow: 'hidden' };
        }
      },
    );

    // Channel Maximize reaction
    const chartMaximizedReaction = reaction(
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

    // Handle chart view change
    const chartViewChangeReaction = reaction(
      () => this.currView,
      () => {
        console.log('View Changed');
      },
    );

    this.reactions.push(chartLengthReaction, chartMaximizedReaction, chartViewChangeReaction);
  }
}
