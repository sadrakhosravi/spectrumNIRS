/*---------------------------------------------------------------------------------------------
 *  Charts X Axis View Model.
 *  Uses Mobx observable pattern.
 *  Handles the X axis UI ticks and logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { action, makeObservable, observable } from 'mobx';

// Model
import { XAxisModel } from '../../models/Chart';

// Types
import type { ChartType } from '../../models/Chart';
import type { Axis } from '@arction/lcjs';

type DivisionsType = {
  name: string;
  value: number;
};

const divisions: DivisionsType[] = [
  {
    name: '100ms',
    value: 100,
  },
  {
    name: '500ms',
    value: 500,
  },
  {
    name: '1s',
    value: 1000,
  },
  {
    name: '3s',
    value: 3000,
  },
  {
    name: '5s',
    value: 5000,
  },
  {
    name: '10s',
    value: 10000,
  },
  {
    name: '15s',
    value: 15000,
  },
  {
    name: '30s',
    value: 30000,
  },
  {
    name: '60s',
    value: 60000,
  },
  {
    name: '120s',
    value: 120000,
  },
  {
    name: '180s',
    value: 180000,
  },

  {
    name: '360s',
    value: 360000,
  },
];

export class XAxisChartViewModel {
  /**
   * The X Axis chart model
   */
  private model: XAxisModel;
  /**
   * Possible time divisions
   */
  public divisions: DivisionsType[];
  /**
   * The interval of the X axis
   */
  @observable public timeDiv: DivisionsType;
  constructor() {
    this.model = new XAxisModel();
    this.divisions = divisions;
    this.timeDiv = this.divisions[7];

    makeObservable(this);
  }

  /**
   * Initializes the VM and the model
   */
  public init(containerId: string, attachedChart: ChartType) {
    this.model.init(containerId, attachedChart);
    this.setTimeDiv();
  }

  @action public setTimeDiv = (timeDiv?: DivisionsType) => {
    const xAxis = this.model.getXAxis() as Axis;

    if (timeDiv) {
      this.timeDiv = timeDiv;
    } else {
      const div = xAxis.getInterval().end - xAxis.getInterval().start;
      this.timeDiv = {
        name:
          div < 1000
            ? div.toString() + 'ms'
            : div > 10000
            ? div.toString()[0] + div.toString()[1] + 's'
            : div.toString()[0] + 's',
        value: div,
      };
    }

    xAxis?.setInterval(xAxis.getInterval().start, xAxis.getInterval().start + this.timeDiv.value);
    xAxis.release();
  };

  /**
   * Performs memory and listener cleanups
   */
  public cleanup() {
    this.model.cleanup();
  }
}