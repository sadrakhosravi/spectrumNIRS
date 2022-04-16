import { translatePoint } from '@arction/lcjs';
import type { Token } from '@arction/eventer';

// Components
import { ChannelLane } from './ChannelLane';

// Styles
import * as styles from './channelUI.module.scss';

// Types
import type { ChannelSizeType, ChartType } from '../types';

/**
 * A class that creates channel UI elements and manages
 * its updates.
 * @version 0.1.0
 */
export class ChannelUI {
  /**
   * The id of the container that the channels attaches to
   */
  private containerId: string;
  /**
   * The created channel UI container that houses the channel information
   */
  protected channelUIContainer: HTMLDivElement | null;
  /**
   * The chart instance linked to this channel.
   */
  protected chart: ChartType;
  /**
   * The token of the resize listener for memory cleanup or null if none exists
   */
  protected resizeListenerToken: Token | null;
  /**
   * The channel lane element
   */
  protected channelLane: ChannelLane | null;

  constructor(containerId: string, chart: ChartType) {
    this.containerId = containerId;
    this.channelUIContainer = null;
    this.chart = chart;
    this.resizeListenerToken = null;
    this.channelLane = null;
    this.createUIElement();
    this.listenForChartResize();
  }

  /**
   * Creates the channel's UI elements
   */
  private createUIElement() {
    const channelContainer = document.getElementById(this.containerId) as HTMLDivElement;
    const chartSize = this.getChartSize();

    // Create and append the div element
    const div = document.createElement('div');
    channelContainer.appendChild(div);

    div.innerHTML = `
        <button class="${styles.ChannelUIInfo}">
          <span></span>
          <span>Name</span>
        </button>
      `;

    div.style.height = chartSize.height + 'px';
    div.className = styles.ChannelUI;

    this.channelUIContainer = div;

    this.channelLane = new ChannelLane(chartSize, this.chart.engine.container);
  }

  /**
   * @returns the x,y position and height and width of the chart
   */
  private getChartSize(): ChannelSizeType {
    // Get each chart position needed for aligning the ChannelUI elements
    // Get the top left corner
    const posEngine = translatePoint({ x: 0, y: 0 }, this.chart.uiScale, this.chart.engine.scale);
    const posDocument = this.chart.engine.engineLocation2Client(posEngine.x, posEngine.y);

    const posEngine2 = translatePoint(
      { x: 100, y: 100 },
      this.chart.uiScale,
      this.chart.engine.scale,
    );
    const posDocument2 = this.chart.engine.engineLocation2Client(posEngine2.x, posEngine2.y);

    const height = Math.abs(posDocument2.y - posDocument.y);
    const width = Math.abs(posDocument2.x - posDocument.x);

    return { x: posDocument.x, y: posDocument2.y - 95, height, width };
  }

  /**
   * Listens for the linked chart resize event
   */
  private listenForChartResize() {
    this.resizeListenerToken = this.chart.onResize(() => {
      this.handleChartResize();
    });
  }

  /**
   * Handles chart resize event fired
   */
  private handleChartResize() {
    const chartSize = this.getChartSize();
    (this.channelUIContainer as HTMLDivElement).style.height = chartSize.height + 'px';
    console.log(chartSize);
    this.channelLane?.updateChannelLane(chartSize);
  }

  /**
   * Disposes all the references and listeners
   */
  public dispose() {
    // Remove the element
    this.channelUIContainer?.remove();
    this.channelUIContainer = null;

    // Remove the listeners
    this.chart.offResize(this.resizeListenerToken as Token);
    this.resizeListenerToken = null;

    // @ts-ignore
    this.chart = null;
  }
}
