/*---------------------------------------------------------------------------------------------
 *  ChartViewModel View Model.
 *  Uses Mobx observable pattern.
 *  Manages the chart instance
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { action, makeObservable, observable, reaction, computed } from 'mobx';

// Model
import { ChartModel, ChartChannel } from '../../models/Chart';

// Types
import type { ChartSeries, DashboardChart } from '../../models/Chart';
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
  @observable public chartContainerStyle: CSSProperties | undefined = { height: '100%' };
  /**
   * The CSS style of the parent container div element
   */
  @observable public parentContainerStyle: CSSProperties | undefined = { overflow: 'hidden' };

  constructor() {
    this.model = new ChartModel();
    this.charts = [];

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
  @action public addSeries(chartId: string) {
    const chart = this.charts.find((chart) => chart.dashboardChart.getId() === chartId);

    // If the chart was not found, something has gone wrong
    if (!chart) throw new Error('The chart was not found! Try again');

    const series = chart.dashboardChart.addLineSeries('Example');
    chart.series.push(series);
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

        // Set the style of the chart and parent div containers
        if (totalCharts > 12) {
          const diff = (totalCharts - 12) * 100; // 150px for each chart;
          this.chartContainerStyle = { height: `calc(100% + ${diff}px)` };
          this.parentContainerStyle = { overflow: 'auto' };
        }

        if (totalCharts < 12) {
          this.chartContainerStyle = { height: '100%' };
          this.parentContainerStyle = { overflow: 'hidden' };
        }
      },
    );
  }
}

export default ChartViewModel;
