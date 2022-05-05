import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { msToTime } from '@utils/helpers';

// Styles
import * as styles from './channelLanes.module.scss';

// View Models
import { chartVM } from '@store';
import { ChartCursorsViewModel } from '@viewmodels/index';

export const ChartCursors = observer(() => {
  const cursorsVM = React.useMemo(() => new ChartCursorsViewModel(), []);

  const cursorContainerId = React.useId();
  const cursorContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    return () => {
      (cursorContainerRef.current as HTMLDivElement).removeEventListener('mousemove', onMouseMove);
      (cursorContainerRef.current as HTMLDivElement).removeEventListener(
        'mousemove',
        onMouseMoveMaximized,
      );

      cursorsVM.dispose();
    };
  }, []);

  // Adds cursors elements in the view model
  const createCursors = React.useCallback(() => {
    cursorsVM.createCursors(chartVM.charts);
    (cursorContainerRef.current as HTMLDivElement).addEventListener('mousemove', onMouseMove);
  }, []);

  const createCursorsMaximized = React.useCallback(() => {
    const chart = chartVM.charts.find((chart) => chart.id === chartVM.isChannelMaximized);
    if (!chart) return;
    cursorsVM.createCursors([chart]);

    (cursorContainerRef.current as HTMLDivElement).addEventListener(
      'mousemove',
      onMouseMoveMaximized,
    );
  }, []);

  const onMouseMove = React.useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      cursorsVM.updateCursorPos(e, chartVM.charts);
    });
  }, []);

  const onMouseMoveMaximized = React.useCallback((e: MouseEvent) => {
    const chart = chartVM.charts.find((chart) => chart.id === chartVM.isChannelMaximized);
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
      onMouseEnter={chartVM.isChannelMaximized ? createCursorsMaximized : createCursors}
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
              cursorsVM.cursors[0].x - (chartVM.isChannelMaximized ? 25 : 32)
            }px)`,
          }}
        >
          {msToTime(cursorsVM.cursors[0].xVal)}
        </div>
      )}
    </div>
  );
});
