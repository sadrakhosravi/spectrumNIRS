import * as React from 'react';
import Tippy from '@tippyjs/react';
import { msToTime } from '@utils/helpers';

// Styles
import * as styles from './recordingItem.module.scss';

// Components

// Icons
import { FiCornerUpRight, FiFileText } from 'react-icons/fi';

const iconSettings = {
  size: '16px',
};

type RecordingItemType = {
  id: string;
  title: string;
  lastUpdate: number;
  isSelected: boolean;
  description?: string;
  setter?: (id: string) => void;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
};

export const RecordingItem = ({
  id,
  title,
  description,
  lastUpdate,
  isSelected,
  setter,
  onClick,
  onDoubleClick,
}: RecordingItemType) => {
  let lastUpdateToDisplay = React.useMemo(() => {
    // Format last time stamp
    const currTimestamp = Date.now();
    const diff = currTimestamp - lastUpdate;

    // If the difference between the last update and now is less than 24 hours,
    // format based on time ago, else format as a time.
    if (diff < 86_600_000) {
      const timeUnpacked = msToTime(diff).split(':');

      // Hours
      const hours = timeUnpacked[0] === '00' ? '' : `${timeUnpacked[0]}`;
      const minutes = timeUnpacked[1] === '00' ? '' : `${timeUnpacked[1]}`;
      const seconds = timeUnpacked[2];

      let hoursStr = (hours[0] === '0' ? hours.slice(1) : hours) + ' hr';
      let minutesStr = minutes[0] === '0' ? minutes.slice(1) : minutes + ' min';

      hoursStr = hoursStr[0] === '1' ? hoursStr : hoursStr + 's';
      minutesStr = minutesStr[0] === '1' ? minutesStr : minutesStr + 's';

      // Format the string;
      return `${hoursStr} ${minutesStr} ${seconds} sec ago`;
    }
  }, []);

  return (
    <div
      className={`${styles.RecordingItem} ${isSelected ? styles.RecordingItemActive : ''}`}
      title="Double click to open the recording"
      onDoubleClick={onDoubleClick}
      onClick={() => setter && setter(id)}
    >
      <span className={styles.Icon}>
        <FiFileText size="52px" strokeWidth={1.5} />
      </span>
      <span className={styles.Info}>
        <span className="text-larger">{title}</span>
        <span className={styles.LastUpdate}>Last Update: {lastUpdateToDisplay}</span>
        <span>{description || 'No description'}</span>
      </span>
      <span className={styles.Buttons}>
        <Tippy content="Open Recording" placement="bottom">
          <button onClick={onClick}>
            <FiCornerUpRight {...iconSettings} />
          </button>
        </Tippy>
      </span>
    </div>
  );
};
