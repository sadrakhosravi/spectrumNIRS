import * as React from 'react';
import Tippy from '@tippyjs/react';
import { msToTime } from '@utils/helpers';

// Styles
import styles from './recordingItem.module.scss';

// Components

// Icons
import { FiCornerUpRight, FiTrash, FiFileText } from 'react-icons/fi';
import { recordingVM } from '/@/viewmodels/VMStore';

const iconSettings = {
  size: '16px',
};

type RecordingItemType = {
  id: number;
  title: string;
  lastUpdate: number;
  isSelected: boolean;
  isActive: boolean;
  description?: string;
  enableDelete?: boolean;
  setter?: (id: number) => void;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
};

export const RecordingItem = ({
  id,
  title,
  description,
  lastUpdate,
  isSelected,
  isActive,
  enableDelete,
  setter,
  onClick,
  onDoubleClick,
}: RecordingItemType) => {
  const lastUpdateToDisplay = React.useMemo(() => {
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
      const seconds =
        timeUnpacked[2][0] === '0' ? timeUnpacked[2][1] : timeUnpacked[2];

      let hoursStr = (hours[0] === '0' ? hours[1] : hours) + ' hr';
      let minutesStr = (minutes[0] === '0' ? minutes[1] : minutes) + ' min';

      hoursStr = hoursStr && (hoursStr[0] === '1' ? hoursStr : hoursStr + 's');
      minutesStr =
        minutesStr && (minutesStr[0] === '1' ? minutesStr : minutesStr + 's');
      console.log(hours);
      if (hours === '00' || hours.trim() === '') hoursStr = '';
      if (minutes === '00' || minutes.trim() === '') minutesStr = '';

      // Format the string;
      return `${hoursStr || ''} ${minutesStr || ''} ${seconds} sec ago`;
    }

    const date = new Date(lastUpdate).toLocaleDateString();
    return date;
  }, []);

  // Handles the record on delete click button
  const handleRecordDeleteClick = React.useCallback(async () => {
    await recordingVM.deleteRecording(id);
    setter && setter(0);
  }, []);

  return (
    <div
      className={`${styles.RecordingItem} ${
        isSelected ? styles.RecordingItemSelected : ''
      } ${isActive ? styles.RecordingItemActive : ''}`}
      title="Double click to open the recording"
      onDoubleClick={onDoubleClick}
      onClick={() => setter && setter(id)}
    >
      <span className={styles.Icon}>
        <FiFileText size="52px" strokeWidth={1.5} />
      </span>
      <span className={styles.Info}>
        <span className="text-larger">
          {title}{' '}
          {isActive && <span className="italic inline-block">Opened</span>}
        </span>
        <span className={styles.LastUpdate}>
          Last Update: {lastUpdateToDisplay}
        </span>
        <span>{description || 'No description'}</span>
      </span>

      <span className={styles.Buttons}>
        {!isActive && (
          <Tippy content="Open Recording" placement="bottom">
            <button type="button" onClick={onClick}>
              <FiCornerUpRight {...iconSettings} />
            </button>
          </Tippy>
        )}
        {enableDelete && (
          <Tippy content="Delete Recording" placement="bottom">
            <button type="button" onClick={handleRecordDeleteClick}>
              <FiTrash {...iconSettings} />
            </button>
          </Tippy>
        )}
      </span>
    </div>
  );
};
