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
import { FiRefreshCcw } from 'react-icons/fi';

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
          <Button
            text="Open Recording"
            disabled={selectedRecording === ''}
            onClick={() => {
              recordingVM.setCurrentRecording(selectedRecording);
              setSelectedRecording('');
            }}
          />
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
      noContentMessage={
        recordingVM.searchedRecordings.length === 0
          ? 'No recordings found! Please create a recording or import from a file.'
          : null
      }
    >
      <div className={styles.ContentClickArea} onClick={() => setSelectedRecording('')} />

      {/* Show recordings */}
      <div className={styles.RecordingsList}>
        {recordingVM.searchedRecordings.map((recording, i) => (
          <RecordingItem
            id={recording.id}
            title={recording.name}
            isSelected={selectedRecording === recording.id}
            isActive={
              recordingVM.currentRecording
                ? recordingVM.currentRecording.name === recording.name
                : false
            }
            description={recording.description || ''}
            lastUpdate={recording.updated_timestamp}
            key={recording.id || i}
            onClick={() => recordingVM.setCurrentRecording(recording.id)}
            onDoubleClick={() => recordingVM.setCurrentRecording(recording.id)}
            setter={setSelectedRecording}
          />
        ))}
      </div>
    </DialogContainer>
  );
});
