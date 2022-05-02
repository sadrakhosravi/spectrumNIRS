/*---------------------------------------------------------------------------------------------
 *  Filter Settings View Model.
 *  Uses Mobx observable pattern.
 *  Handles the UI logic of digital filters settings.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable, reaction } from 'mobx';

// Models
import { Lowpass } from '../models/Filters';

// View Models
import type ChartViewModel from './Chart/ChartViewModel';

export class FilterSettingsViewModel {
  private chartVM: ChartViewModel;
  private lowpassModel: Lowpass;
  private samplingRate: number;
  @observable public isActive: boolean;
  @observable public cutoffFrequency: number;
  @observable public order: number;

  constructor(chartVM: ChartViewModel) {
    this.chartVM = chartVM;
    this.lowpassModel = new Lowpass();
    this.samplingRate = 1000;
    this.isActive = false;
    this.cutoffFrequency = 5;
    this.order = 6;

    makeObservable(this);
    this.handleReactions();
  }

  /**
   * Sets whether the global filters are active.
   */
  @action public setIsActive(value: boolean) {
    console.log(value);
    this.isActive = value;
  }

  /**
   * Updates the current cutoff frequency.
   */
  @action public setCutoffFrequency(cutoffFrequency: number) {
    this.cutoffFrequency = cutoffFrequency;
  }

  /**
   * Updates the current filter order.
   */
  @action public setOrder(order: number) {
    this.order = order;
  }

  /**
   * Handles the observable changes.
   */
  private handleReactions() {
    const handleFilterChange = () => {
      console.log('Filter Changed');
      if (!this.isActive) {
        this.chartVM.charts.forEach((chart) => {
          chart.filters = null;
        });
        return;
      }
      this.chartVM.charts.forEach((chart) => {
        chart.filters = this.lowpassModel.createLowpassFilter(
          this.samplingRate,
          this.cutoffFrequency,
          this.order,
        );
      });
    };

    reaction(() => this.isActive, handleFilterChange);
    reaction(() => this.cutoffFrequency, handleFilterChange);
    reaction(() => this.order, handleFilterChange);
  }
}
