import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './openRecordings.module.scss';

// Components
import { DialogContainer } from '../../Elements/DialogContainer';
import { SearchInput } from '../../Form';
import { Button, IconOnlyButton } from '../../Elements/Buttons';
import { RecordingItem } from './RecordingItem';

// Icons
import { FiRefreshCcw, FiInfo } from 'react-icons/fi';

// View Models
import { appRouterVM, recordingVM } from '@store';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

export const OpenRecordings = observer(() => {
  const [selectedRecording, setSelectedRecording] = React.useState('');
  const searchInputId = React.useId();

  // Load all recordings
  React.useEffect(() => {
    (async () => {
      recordingVM.loadAllRecordings();
    })();

    return () => recordingVM.clearAllRecordings();
  }, []);

  // Handles the refresh button click
  const handleRefreshBtnClick = React.useCallback(() => {
    const searchInput = document.getElementById(searchInputId) as HTMLInputElement;
    searchInput.value = '';
    recordingVM.loadAllRecordings();
  }, []);

  return (
    <DialogContainer
      title="Recordings"
      actionButtons={
        <>
          <Button text="Import Recording" disabled={true} />
          <Button text="Open Recording" disabled={selectedRecording === ''} />
          <Button
            text="New Recording"
            onClick={() => appRouterVM.navigateTo(AppNavStatesEnum.NEW_RECORDING)}
          />
        </>
      }
      searchInput={
        <SearchInput
          placeholder="Search for recordings..."
          onChange={(e) => recordingVM.setSearchedRecordings(e.target.value)}
          id={searchInputId}
        />
      }
      topBarActionButtons={
        <IconOnlyButton
          icon={<FiRefreshCcw size="16px" strokeWidth={2.5} />}
          tooltipText="Refresh"
          onClick={() => handleRefreshBtnClick()}
        />
      }
      closable={false}
    >
      <div className={styles.ContentClickArea} onClick={() => setSelectedRecording('')} />

      {/* Show recordings */}
      {recordingVM.searchedRecordings.map((recording, i) => (
        <RecordingItem
          id={recording.id}
          title={recording.name}
          isSelected={selectedRecording === recording.id}
          description={recording.description}
          lastUpdate={recording.last_update_timestamp}
          key={recording.id || i}
          setter={setSelectedRecording}
        />
      ))}

      {/* Show a message if no recording exits */}
      {recordingVM.recordings.length === 0 && (
        <div className={styles.NoRecordsContainer}>
          <FiInfo size="102px" opacity={0.6} strokeWidth={1.5} />
          <span className="text-larger">
            No recordings found! Please create a recording or import from a file.
          </span>
        </div>
      )}
    </DialogContainer>
  );
});
