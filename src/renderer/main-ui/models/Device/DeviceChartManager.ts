/*---------------------------------------------------------------------------------------------
 *  Device Chart Manager Model.
 *  Holds logic related to the device chart creation and appending data.
 *  Used Mobx observable pattern.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { makeObservable, observable, toJS } from 'mobx';
import { DashboardChart, ChartSeries } from '../Chart';

// View Models
import { chartVM } from '/@/viewmodels/VMStore';

export class DeviceChartManagerModel {
  /**
   * The chart channels of the device.
   */
  @observable private readonly channels: string[];
  /**
   * Charts channels and series pointer.
   */
  public readonly charts: { chart: DashboardChart; series: ChartSeries }[];
  /**
   * The current sampling rate of the device.
   */
  @observable private samplingRate: number;

  constructor(channels: string[], samplingRate: number) {
    this.channels = channels;
    this.charts = [];
    this.samplingRate = samplingRate;

    makeObservable(this);
  }

  /**
   * Creates chart channels for the device.
   */
  public createChartChannels() {
    // Add chart channels
    this.channels.forEach((channelName) => {
      const chart = chartVM.addChart();
      const series = chartVM.addSeries(chart.id, channelName);

      this.charts.push({ chart, series });
    });

    // Set the series sampling rate and data cleaning
    this.charts.forEach((channel) => {
      channel.series.setSeriesCleaning(1);
      channel.series.setSeriesSamplingRate(toJS(this.samplingRate));
    });
  }

  /**
   * Disposes chart channels and removes all listeners.
   */
  public disposeChannels() {
    this.charts.forEach((chart) => {
      chartVM.removeChart(chart.chart.id);
    });
    this.charts.length = 0;
  }
}
