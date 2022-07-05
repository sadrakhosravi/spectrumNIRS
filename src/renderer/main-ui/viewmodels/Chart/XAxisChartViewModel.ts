/*---------------------------------------------------------------------------------------------
 *  Charts X Axis View Model.
 *  Uses Mobx observable pattern.
 *  Handles the X axis UI ticks and logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import { action, makeObservable, observable } from 'mobx';

// Model
import { XAxisModel } from '@models/Chart';

// Types
import type { ChartType } from '@models/Chart';
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
   * The X Axis chart model.
   */
  private model: XAxisModel;
  /**
   * Condition whether the X axis has been stopped manually.
   */
  @observable private isAxisLocked: boolean;
  /**
   * Possible time divisions.
   */
  public divisions: DivisionsType[];
  /**
   * The interval of the X axis.
   */
  @observable public timeDiv: DivisionsType;
  constructor() {
    this.model = new XAxisModel();
    this.divisions = divisions;
    this.isAxisLocked = false;
    this.timeDiv = this.divisions[7];

    makeObservable(this);
  }

  /**
   * @returns whether the X axis is locked/stopped manually.
   */
  public get isLocked() {
    return this.isAxisLocked;
  }

  /**
   * Sets the chart's right padding in pixels.
   * @param padInPixels
   */
  public setChartPaddingRight(padInPixels: number) {
    this.model.getChart()?.setPadding({ right: padInPixels });
  }

  /**
   * Initializes the VM and the model
   */
  public init(containerId: string, attachedChart: ChartType) {
    this.model.init(containerId, attachedChart);
    this.setTimeDiv();
  }

  /**
   * Toggles the X axis lock. Locks / Unlocks it
   */
  @action public toggleAxisLock = () => {
    this.isAxisLocked = !this.isAxisLocked;

    // Apply it to the Axis
    if (this.isAxisLocked) {
      this.model.getXAxis()?.stop();
      this.model.getAttachedChart()?.getDefaultAxisX().stop();
      return;
    }

    this.model.getXAxis()?.release();
    this.model.getAttachedChart()?.getDefaultAxisX().release();
  };

  /**
   * Sets the X axis time division and releases it.
   */
  @action public setTimeDiv = (timeDiv?: DivisionsType) => {
    const attachedChart = this.model.getAttachedChart();
    if (!attachedChart) return;

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

    const interval = xAxis.getInterval();
    const seriesXMax =
      attachedChart.getSeries().length !== 0 &&
      attachedChart.getSeries()[0].getXMax();

    let end = interval.end;

    if (seriesXMax && interval.end > seriesXMax) {
      end = seriesXMax;
    }

    xAxis?.setInterval(
      end - this.timeDiv.value,
      end,
      0,
      this.isAxisLocked ? true : false
    );

    if (!this.isAxisLocked) {
      xAxis.release();
      attachedChart?.getDefaultAxisX().release();
    }
  };

  /**
   * Performs memory and listener cleanups
   */
  public dispose() {
    this.model.dispose();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.model = null;
  }
}
