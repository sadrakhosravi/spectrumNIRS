/**
 * Creates a chart dashboard based on the number of channels
 */

// Import LightningChartJS
import lcjs from '@arction/lcjs';
const { lightningChart } = lcjs;

class ChartDashboard {
  channelCount: number;
  numberOfRows: number;
  constructor(channelCount = 4) {
    this.channelCount = channelCount; //Total number of channels displayed
    this.numberOfRows = channelCount * 2; //Dashboard total grid row for each chart to display
  }

  /**
   * Creates dashboard based on the number of channels given.
   * @returns {Object} dashboard - return a dashboard object containing numberOfChannels
   */
  createDashboard() {
    const dashboard = lightningChart().Dashboard({
      numberOfRows: this.numberOfRows, //Total number of rows for the dashboard - default 8
      numberOfColumns: 1, //Full width
      container: 'chart', //div id to attach to
      antialias: true,
    });

    return dashboard;
  }
}

export default ChartDashboard;