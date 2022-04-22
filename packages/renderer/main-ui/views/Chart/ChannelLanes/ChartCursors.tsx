import * as React from 'react';

// Styles
import * as styles from './channelLanes.module.scss';

// View Models
import { vm } from '../ChartView';

export const ChartCursors = () => {
  const cursorContainerId = React.useId();

  // const cursorContainer = document.getElementById(cursorContainerId);
  React.useEffect(() => {
    //@ts-ignore
    let time1 = 0;
    // const totalCharts = vm.charts.length;

    // On cursor mouse move in chart area
    // const onMouseMove = (e: MouseEvent) => {
    //   // Use for loop for faster iterations
    //   vm.charts.forEach((chart) => chart.dashboardChart.showCursorOnClosesPoint(e));
    // };

    // cursorContainer?.addEventListener('mousemove', onMouseMove);

    return () => {
      // cursorContainer?.removeEventListener('mousemove', onMouseMove);
    };
  }, [vm.charts.length]);

  return <div id={cursorContainerId} className={styles.ChartCursorContainer}></div>;
};
