import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './channelLanes.module.scss';

// View Models
import { vm } from '../ChartView';
import { ChartCursorsViewModel } from '@viewmodels/index';

const cursorsVM = new ChartCursorsViewModel();

export const ChartCursors = observer(() => {
  const cursorContainerId = React.useId();

  React.useEffect(() => {
    const cursorContainer = document.getElementById(cursorContainerId);
    const example = document.getElementById('example') as HTMLDivElement;
    const example2 = document.getElementById('example2') as HTMLDivElement;

    vm.charts[0].series[0].changeSeriesColor('#fff');

    //@ts-ignore
    let time1 = 0;
    // On cursor mouse move in chart area
    const onMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        // Use for loop for faster iterations

        const location = vm.charts[0].dashboardChart.showCursorOnClosesPoint(e) as any;

        if (!location) return;
        example.style.transform = `translate3d(${location.x}px, ${location.y}px, 0)`;
        example2.style.transform = `translate3d(${location.x}px, ${location.y + 200}px, 0)`;
      });
    };

    // cursorContainer?.addEventListener('mousemove', onMouseMove);

    return () => {
      cursorContainer?.removeEventListener('mousemove', onMouseMove);
    };
  }, [vm.charts.length]);

  const createCursors = React.useCallback(() => {
    cursorsVM.createCursors(vm.charts.length);
  }, []);

  const deleteCursors = React.useCallback(() => {
    cursorsVM.deleteCursors();
  }, []);

  return (
    <div
      id={cursorContainerId}
      className={styles.ChartCursorContainer}
      onMouseOver={createCursors}
      onMouseLeave={deleteCursors}
    >
      {cursorsVM.cursors.map((cursor, i) => (
        <div id={`cursor-${i}`} className={styles.CursorItem}>
          {cursor.value}
        </div>
      ))}
    </div>
  );
});
