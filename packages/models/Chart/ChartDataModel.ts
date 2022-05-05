/*---------------------------------------------------------------------------------------------
 *  Chart Data Model.
 *  Stores the data that will be graphed by the chart engine.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import EventEmitter from 'node:events';

interface IDataSet {
  [key: string]: number[];
}

export class ChartDataModel {
  dataSet: IDataSet;
  emitter: EventEmitter;
  constructor() {
    this.dataSet = {};
    this.emitter = new EventEmitter();
  }

  /**
   * @returns the emitter instance to listen for events.
   * The `data` event will be emitted when the data is ready.
   */
  public get listener() {
    return this.emitter;
  }

  public createDataModels(channelNames: string[]) {
    channelNames.forEach((channelName) => (this.dataSet[channelName] = []));
  }

  /**
   * Emits the `data` event.
   */
  public dataIsReady() {
    this.emitter.emit('data');
  }
}
