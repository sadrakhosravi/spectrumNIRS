import * as React from 'react';

// Styles
import * as styles from './screenView.module.scss';

// Components
import { WidgetsRouter } from '@widgets/WidgetsRouter';
import { ToolbarRouter } from '../../components/Toolbar';
import { ChartView } from '../Chart/ChartView';

type ScreenViewType = {
  enableWidgets?: boolean;
};

export const ScreenView = ({ enableWidgets }: ScreenViewType) => {
  const contentViewId = React.useId();
  const widgetViewId = React.useId();
  const splitterId = React.useId();

  const resizeSplitView = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Set cursor style to say the same while resizing
    document.body.style.cursor = 'ew-resize';

    const contentView = document.getElementById(contentViewId) as HTMLDivElement;
    const widgetView = document.getElementById(widgetViewId) as HTMLDivElement;
    const splitterEl = document.getElementById(splitterId) as HTMLDivElement;

    // Get the initial mouse position and element widths as the reference
    const initialX = e.pageX;
    const contentViewInitialWidth = contentView.clientWidth;
    const widgetViewInitialWidth = widgetView.clientWidth;

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      // Calculate the new size based on percentage
      const pointerXDiff = mouseMoveEvent.pageX - initialX;

      if (widgetViewInitialWidth === 0) {
        contentView.style.width = 'calc(100% - 350px)';
        widgetView.style.width = '350px';
        splitterEl.style.right = 350 - 2.5 + 'px';
      }

      // Dragging to the left
      if (pointerXDiff < 0) {
        if (pointerXDiff > -200) {
          contentView.style.width = `${contentViewInitialWidth - Math.abs(pointerXDiff)}px`;
          widgetView.style.width = `${widgetViewInitialWidth + Math.abs(pointerXDiff)}px`;
          splitterEl.style.right = widgetView.clientWidth - 2.5 + 'px';
        }
      }

      if (pointerXDiff > 0) {
        if (pointerXDiff < 125) {
          contentView.style.width = `${contentViewInitialWidth + Math.abs(pointerXDiff)}px`;
          widgetView.style.width = `${widgetViewInitialWidth - Math.abs(pointerXDiff)}px`;
          splitterEl.style.right = widgetView.clientWidth - 2.5 + 'px';
        }

        if (pointerXDiff > 250) {
          contentView.style.width = '100%';
          widgetView.style.width = '0%';
          splitterEl.style.right = 2.5 + 'px';
        }
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const handleSplitterDoubleClick = React.useCallback(() => {
    const contentView = document.getElementById(contentViewId) as HTMLDivElement;
    const widgetView = document.getElementById(widgetViewId) as HTMLDivElement;
    const splitterEl = document.getElementById(splitterId) as HTMLDivElement;

    contentView.style.width = 'calc(100% - 350px)';
    widgetView.style.width = '350px';

    splitterEl.style.right = 350 - 2.5 + 'px';
  }, []);

  return (
    <div className={styles.ScreenView}>
      {enableWidgets && (
        <div className={styles.SplitView}>
          <div className={styles.ContentView} id={contentViewId}>
            <ToolbarRouter />
            <ChartView />
          </div>
          <div
            id={splitterId}
            className={styles.SplitterBar}
            onMouseDownCapture={resizeSplitView}
            onDoubleClick={handleSplitterDoubleClick}
          />
          <div className={styles.WidgetView} id={widgetViewId}>
            <WidgetsRouter />
          </div>
        </div>
      )}
    </div>
  );
};
