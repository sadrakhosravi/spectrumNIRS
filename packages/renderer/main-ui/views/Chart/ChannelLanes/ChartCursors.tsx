import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './channelLanes.module.scss';

// View Models
import { vm } from '../ChartView';
import { ChartCursorsViewModel } from '@viewmodels/index';

// Types

const cursorsVM = new ChartCursorsViewModel();

export const ChartCursors = observer(() => {
  const cursorContainerId = React.useId();
  const cursorContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    return () => {
      (cursorContainerRef.current as HTMLDivElement).removeEventListener('mousemove', onMouseMove);
      (cursorContainerRef.current as HTMLDivElement).removeEventListener(
        'mousemove',
        onMouseMoveMaximized,
      );
    };
  }, []);

  // Adds cursors elements in the view model
  const createCursors = React.useCallback(() => {
    cursorsVM.createCursors(vm.charts);
    (cursorContainerRef.current as HTMLDivElement).addEventListener('mousemove', onMouseMove);
  }, []);

  const createCursorsMaximized = React.useCallback(() => {
    const chart = vm.charts.find((chart) => chart.id === vm.isChannelMaximized);
    if (!chart) return;
    cursorsVM.createCursors([chart]);

    (cursorContainerRef.current as HTMLDivElement).addEventListener(
      'mousemove',
      onMouseMoveMaximized,
    );
  }, []);

  const onMouseMove = React.useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      cursorsVM.updateCursorPos(e, vm.charts);
    });
  }, []);

  const onMouseMoveMaximized = React.useCallback((e: MouseEvent) => {
    const chart = vm.charts.find((chart) => chart.id === vm.isChannelMaximized);
    if (!chart) return;
    requestAnimationFrame(() => {
      cursorsVM.updateCursorPos(e, [chart]);
    });
  }, []);

  // Deletes the cursor model from the view model
  const deleteCursors = React.useCallback(() => {
    cursorsVM.deleteCursors();
    (cursorContainerRef.current as HTMLDivElement).removeEventListener('mousemove', onMouseMove);
    (cursorContainerRef.current as HTMLDivElement).removeEventListener(
      'mousemove',
      onMouseMoveMaximized,
    );
  }, []);

  return (
    <div
      id={cursorContainerId}
      ref={cursorContainerRef}
      className={styles.ChartCursorContainer}
      onMouseEnter={vm.isChannelMaximized ? createCursorsMaximized : createCursors}
      onMouseLeave={deleteCursors}
    >
      {cursorsVM.cursors.map(
        (cursor, i) =>
          cursor.y !== 0 && (
            <div
              key={cursor.color + i + 'cursor'}
              className={`${styles.CursorItem} ${cursor.x > 600 && styles.CursorItemSpanReversed}`}
              style={{
                transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
                background: cursor.color,
              }}
            >
              <span>{cursor.yVal.toFixed(3)}</span>
            </div>
          ),
      )}
      {cursorsVM.cursors.length > 0 && cursorsVM.cursors[0].y !== 0 && (
        <div
          key={'cursor-x-axis'}
          className={`${styles.CursorXAxisItem}`}
          style={{
            transform: `translateX(${
              cursorsVM.cursors[0].x - (vm.isChannelMaximized ? 25 : 32)
            }px)`,
          }}
        >
          {cursorsVM.cursors[0].xVal.toFixed(3)}
        </div>
      )}
    </div>
  );
});
