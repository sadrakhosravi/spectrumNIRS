import * as React from 'react';

// Styles
import * as styles from '../channelLanes.module.scss';

// Types
import type { ChartChannel } from '@models/Chart';

type ChannelSettingsType = {
  channelInfo: ChartChannel;
  parentRef: HTMLButtonElement;
  closeSetter: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChannelSettings = ({ parentRef, closeSetter }: ChannelSettingsType) => {
  const height = 250;

  const parentRefSize = parentRef.getBoundingClientRect();
  const topMargin = 15;
  let top = parentRefSize.top + parentRefSize.height + topMargin;
  let left = parentRefSize.left - 45;
  let flip = false;

  // Get viewport height and flip the indicator if needed
  const windowHeight = window.innerHeight;
  if (top + height > windowHeight - 15) {
    top = parentRefSize.y - height - topMargin;
    flip = true;
  }

  // Close the popup on Escape key press
  React.useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      e.key === 'Escape' && closeSetter(false);
    };
    document.addEventListener('keydown', onKeyPress);

    return () => {
      document.removeEventListener('keydown', onKeyPress);
    };
  }, []);

  return (
    <>
      <div className={styles.ChannelSettings} style={{ top, left, height }}>
        {/* The triangle indicator */}
        <span
          className={
            flip ? styles.ChannelSettingsIndicatorBottom : styles.ChannelSettingsIndicatorTop
          }
        />
        <div></div>
        Test
      </div>
      <div className="overlay-transparent" onClick={() => closeSetter(false)}></div>
    </>
  );
};
