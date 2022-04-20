import * as React from 'react';

// Styles
import * as styles from './channelLanes.module.scss';

type ChannelSettingsType = {
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

  // Get viewport height
  const windowHeight = window.innerHeight;
  if (top + height > windowHeight - 15) {
    top = parentRefSize.y - height - topMargin;
    flip = true;
  }

  console.log(flip);

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
        Test
      </div>
      <div className="overlay-transparent" onClick={() => closeSetter(false)}></div>
    </>
  );
};
