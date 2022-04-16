import type { ChannelSizeType } from '../types';

// Styles
import * as styles from './channelUI.module.scss';

/**
 * The channel lane component.
 * Houses channel overlay and channel separator.
 * @version 0.1.0
 */
export class ChannelLane {
  /**
   * The size of the chart to adjust to
   */
  private size: ChannelSizeType;
  /**
   * The chart's engine parent div element
   */
  parentContainer: HTMLDivElement;
  /**
   * The current HTML element for channel lane
   */
  channelLaneElement: HTMLDivElement | null;

  constructor(_size: ChannelSizeType, _parentContainer: HTMLDivElement) {
    this.size = _size;
    this.parentContainer = _parentContainer;
    this.channelLaneElement = null;

    this.addChartChannelSeparator();
  }

  public addChartChannelSeparator() {
    const div = document.createElement('div');
    div.classList.add(styles.ChannelLane);

    div.style.height = this.size.height + 'px';
    div.style.top = this.size.y + 'px';

    this.parentContainer.appendChild(div);
    this.channelLaneElement = div;
  }

  public updateChannelLane(size: ChannelSizeType) {
    const div = this.channelLaneElement as HTMLDivElement;
    div.style.top = size.y + 'px';
    div.style.height = size.height + 'px';
  }

  public addChannelOverlay() {}
}
