import * as React from 'react';

// Styles
import * as styles from './openRecordings.module.scss';

// Components
import { SearchInput } from '../Form';
import { Button, CloseButton, IconOnlyButton } from '../Elements/Buttons';
// import { RecordingItem } from './RecordingItem';

// Icons
import { FiRefreshCcw, FiInfo } from 'react-icons/fi';
import { recordingVM } from '@store';

export const OpenRecordings = () => {
  recordingVM.getAllRecordings();

  return (
    <div className={styles.OpenRecordings}>
      {/* Inner container */}
      <div className="relative h-full w-full">
        {/* Action Bar - Contains search and reload button */}
        <div className={styles.ActionBar}>
          <span className="text-larger">Recordings</span>
          <span className={styles.SearchContainer}>
            <SearchInput placeholder="Search for recordings..." />
          </span>
          <span className={styles.ActionButtons}>
            <IconOnlyButton
              icon={<FiRefreshCcw size="16px" strokeWidth={2.5} />}
              tooltipText="Refresh"
            />
          </span>
          <CloseButton className={styles.CloseButton} />
        </div>

        {/* Content Area */}
        <div className={styles.ContentArea}>
          {/* Show recordings */}
          {/* {openRecordingVM.allRecordings.length !== 0 &&
            openRecordingVM.allRecordings.map((_recording) => <RecordingItem />)} */}

          {/* Show a message if no recording exits */}
          <div className={styles.NoRecordsContainer}>
            <FiInfo size="102px" opacity={0.6} strokeWidth={1.5} />
            <span className="text-larger">
              No recordings found! Please create a recording or import from a file.
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.BottomBar}>
          <Button text="Import Recording" />
          <Button text="Open Recording" />
          <Button text="New Recording" onClick={() => recordingVM.createNewRecording()} />
        </div>
      </div>
    </div>
  );
};
