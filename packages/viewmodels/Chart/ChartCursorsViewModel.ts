/*---------------------------------------------------------------------------------------------
 *  Chart Cursors View Model.
 *  Uses Mobx observable pattern.
 *  Manages the nearest point cursor position of each chart.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';

// Types
import type { IChart } from './ChartViewModel';

type CursorType = {
  x: number;
  y: number;
  color: string;
  yVal: number;
  xVal: number;
};

export class ChartCursorsViewModel {
  @observable public cursors: CursorType[];
  /**
   * Used to limit really fast updates
   */
  private lastTimeStamp: number;
  constructor() {
    this.cursors = [];
    this.lastTimeStamp = Date.now();

    makeObservable(this);
  }

  /**
   * Creates the cursor objects and pushes them to the observable.
   * @param channels total number of charts
   */
  @action public createCursors(charts: IChart[]) {
    this.cursors.length = 0;
    for (let i = 0; i < charts.length; i++) {
      const series = charts[i].series[0];
      const seriesColor = series.color;

      const cursor: CursorType = {
        x: 0,
        y: 0,
        xVal: 0,
        yVal: 0,
        color: seriesColor || '#fff',
      };
      this.cursors.push(cursor);
    }
  }

  /**
   * Updates the cursor position
   */
  @action public updateCursorPos(event: MouseEvent, charts: IChart[]) {
    const timeStamp = Date.now();
    if (timeStamp - this.lastTimeStamp < 25) return;

    charts.forEach((chart, i) => {
      const location = chart.dashboardChart.getNearestSeriesPointFromScreen(event);
      if (!location || !location.x) return;

      if (this.cursors.length !== 0) {
        this.cursors[i] = { ...this.cursors[i], ...location };
      }
    });
    this.lastTimeStamp = timeStamp;
  }

  /**
   * Deletes all the chart cursors objects in the observable.
   */
  @action public deleteCursors() {
    this.cursors.length = 0;
  }
}
