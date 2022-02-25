import { Dashboard, lightningChart } from '@arction/lcjs';
import spectrumTheme from './ChartTheme';

const dashboard = (numberOfRows: number, container: string): Dashboard => {
  const dashboard = lightningChart().Dashboard({
    numberOfRows: numberOfRows + 1, //Total number of rows for the dashboard - default 8
    numberOfColumns: 1, //Full width
    container, //div id to attach to
    antialias: true, // for better rendering
    theme: spectrumTheme, // Custom theme for the software
    devicePixelRatio: true,
    lineAntiAlias: true,
  });

  // First column channel info
  // dashboard.setColumnWidth(0, 1);
  // Second column, charts
  // dashboard.setColumnWidth(1, 11);

  // Set each row height
  for (let i = 0; i < numberOfRows + 1; i += 1) {
    if (i === 0) {
      dashboard.setRowHeight(0, 0.3);
    } else {
      dashboard.setRowHeight(i, 1);
    }
  }

  // Row height for the ZoomBandChart
  dashboard.setRowHeight(5, 0.5);

  return dashboard;
};

export default dashboard;
