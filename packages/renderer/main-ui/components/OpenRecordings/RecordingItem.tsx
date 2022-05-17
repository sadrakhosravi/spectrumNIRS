import * as React from 'react';
import Tippy from '@tippyjs/react';

// Styles
import * as styles from './recordingItem.module.scss';

// Components

// Icons
import { FiCornerUpRight, FiFileText } from 'react-icons/fi';

const iconSettings = {
  size: '16px',
};

type RecordingItemType = {
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
};

export const RecordingItem = ({ onClick, onDoubleClick }: RecordingItemType) => {
  return (
    <div
      className={styles.RecordingItem}
      title="Double click to open the recording"
      onDoubleClick={onDoubleClick}
    >
      <span className={styles.Icon}>
        <FiFileText size="52px" strokeWidth={1.5} />
      </span>
      <span className={styles.Info}>
        <span className="text-larger">Title</span>
        <span className={styles.LastUpdate}>Last Update: 2 min ago</span>
        <span>Description</span>
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
