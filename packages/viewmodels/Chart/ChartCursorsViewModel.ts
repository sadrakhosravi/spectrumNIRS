/*---------------------------------------------------------------------------------------------
 *  Chart Cursors View Model.
 *  Uses Mobx observable pattern.
 *  Manages the nearest point cursor position of each chart.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';

type CursorType = {
  x: number;
  y: number;
  color: string;
  value: number;
};

export class ChartCursorsViewModel {
  @observable public cursors: CursorType[];
  constructor() {
    this.cursors = [];

    makeObservable(this);
  }

  @action public createCursors(channels: number) {
    this.cursors.length = 0;
    for (let i = 0; i < channels; i++) {
      const cursor: CursorType = {
        x: 0,
        y: 0,
        value: 0,
        color: '#fff',
      };
      this.cursors.push(cursor);
    }
  }

  @action public deleteCursors() {
    this.cursors.length = 0;
  }
}
