import * as React from 'react';

// Styles
import * as styles from './screenView.module.scss';

// Components
import { WidgetView } from '../WidgetView';

type ScreenViewType = {
  children: React.ReactNode;
  enableWidgets?: boolean;
};

export const ScreenView = ({ enableWidgets, children }: ScreenViewType) => {
  const contentViewId = React.useId();
  const widgetViewId = React.useId();

  const resizeSplitView = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Set cursor style to say the same while resizing
    document.body.style.cursor = 'ew-resize';

    const contentView = document.getElementById(contentViewId) as HTMLDivElement;
    const widgetView = document.getElementById(widgetViewId) as HTMLDivElement;

    // Get the initial mouse position and element widths as the reference
    const initialX = e.pageX;
    const contentViewInitialWidth = contentView.clientWidth;
    const widgetViewInitialWidth = widgetView.clientWidth;

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      // Calculate the new size based on percentage
      const pointerXDiff = mouseMoveEvent.pageX - initialX;

      if (widgetViewInitialWidth === 0) {
        contentView.style.width = '80%';
        widgetView.style.width = '20%';
      }

      // Dragging to the left
      if (pointerXDiff < 0) {
        if (pointerXDiff > -200) {
          contentView.style.width = `${contentViewInitialWidth - Math.abs(pointerXDiff)}px`;
          widgetView.style.width = `${widgetViewInitialWidth + Math.abs(pointerXDiff)}px`;
        }
      }

      if (pointerXDiff > 0) {
        if (pointerXDiff < 125) {
          contentView.style.width = `${contentViewInitialWidth + Math.abs(pointerXDiff)}px`;
          widgetView.style.width = `${widgetViewInitialWidth - Math.abs(pointerXDiff)}px`;
        }

        if (pointerXDiff > 250) {
          contentView.style.width = '100%';
          widgetView.style.width = '0%';
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const handleSplitterDoubleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const contentView = document.getElementById(contentViewId) as HTMLDivElement;
      const widgetView = document.getElementById(widgetViewId) as HTMLDivElement;

      contentView.style.width = '80%';
      widgetView.style.width = '20%';
    },
    [],
  );

  return (
    <div className={styles.ScreenView}>
      {enableWidgets && (
        <div className={styles.SplitView}>
          <div className={styles.ContentView} id={contentViewId}>
            {children}
          </div>
          <div
            className={styles.SplitterBar}
            onMouseDownCapture={resizeSplitView}
            onDoubleClick={handleSplitterDoubleClick}
          />
          <div className={styles.WidgetView} id={widgetViewId}>
            <WidgetView />
          </div>
        </div>
      )}

      {!enableWidgets && <div>{children}</div>}
    </div>
  );
};
