/*---------------------------------------------------------------------------------------------
 *  Device Chart Manager Model.
 *  Holds logic related to the device chart creation and appending data.
 *  Used Mobx observable pattern.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { AppNavStatesEnum } from '@utils/types/AppStateEnum';
import { observable, reaction, toJS } from 'mobx';

// Models
import { IDisposable } from '../Base/IDisposable';
import { ObservableModel } from '../Base/ObservableModel';
import { DashboardChart, ChartSeries } from '../Chart';

// View Models
import { appRouterVM, chartVM } from '/@/viewmodels/VMStore';

export class DeviceChartManagerModel
  extends ObservableModel
  implements IDisposable
{
  private readonly calcChannelNames: string[];
  private readonly PDChannelNames: string[];

  /**
   * Charts channels and series pointer.
   */
  public readonly charts: { chart: DashboardChart; series: ChartSeries }[];
  /**
   * The current sampling rate of the device.
   */
  @observable private samplingRate!: number;

  constructor(
    calcChannelNames: string[],
    PDChannelNames: string[],
    samplingRate: number
  ) {
    super();

    this.calcChannelNames = calcChannelNames;
    this.PDChannelNames = PDChannelNames;
    this.samplingRate = samplingRate;

    this.charts = [];

    this.handleReactions();
  }

  /**
   * Creates chart channels based on the router's current route.
   */
  public createDeviceCharts() {
    // Check if there are any charts and dispose them first.
    this.disposeChannels();

    setTimeout(() => {
      if (appRouterVM.route === AppNavStatesEnum.CALIBRATION)
        this.createChartChannels(this.PDChannelNames);

      if (
        appRouterVM.route === AppNavStatesEnum.RECORD ||
        appRouterVM.route === AppNavStatesEnum.REVIEW
      )
        this.createChartChannels(this.calcChannelNames);
    }, 50);
  }

  /**
   * Creates chart channels for the device.
   */
  private createChartChannels(channels: string[]) {
    // Add chart channels
    channels.forEach((channelName) => {
      const chart = chartVM.addChart();
      const series = chartVM.addSeries(chart.id, channelName);

      this.charts.push({ chart, series });
    });

    // Set the series sampling rate and data cleaning
    this.charts.forEach((channel) => {
      channel.series.setSeriesCleaning(
        appRouterVM.route === AppNavStatesEnum.REVIEW ? undefined : 1
      );
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

  public dispose(): boolean {
    this.reactions.forEach((reaction) => reaction());
    this.reactions.length = 0;

    this.disposeChannels();
    this.charts.length = 0;

    return true;
  }

  /**
   * Handles the reaction to observable changes.
   */
  private handleReactions() {
    const handleAppRouteChange = reaction(
      () => appRouterVM.route,
      () => {
        this.createDeviceCharts();
      }
    );

    this.reactions.push(handleAppRouteChange);
  }
}
