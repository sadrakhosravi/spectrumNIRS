import * as React from 'react';

// Styles
import * as styles from './createRecording.module.scss';

// Components
import { DialogContainer } from '../../Elements/DialogContainer';
import { Button } from '../../Elements/Buttons';

import { Grid } from '../../Elements/Grid';
import { Separator } from '../../Elements/Separator';
import { Alert } from '../../Elements/Alert';

// View Models
import { appRouterVM, recordingVM } from '@store';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

export const CreateNewRecording = () => {
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  // Parses and sends the UI information to the view model
  const handleCreateRecordingClick = React.useCallback(() => {
    const name = nameInputRef.current?.value as string;
    const description = descriptionRef.current?.value as string;

    if (!name) {
      nameInputRef.current?.focus();
      return;
    }

    // Ask view model to create the recording
    recordingVM.createNewRecording(name, description);
  }, []);

  return (
    <DialogContainer
      title="Create a new recording"
      actionButtons={
        <>
          <Button text="Discard" />
          <Button text="Create Recording" onClick={handleCreateRecordingClick} />
        </>
      }
      backButtonOnClick={() => {
        appRouterVM.navigateTo(AppNavStatesEnum.HOME);
      }}
    >
      <div className={styles.MainContainer}>
        <span className="text-larger">Recording Information</span>

        {/* Form */}
        <div className={styles.Form}>
          <Grid columnsTemplate="0.3fr 1fr" rowGap="2rem">
            {/* Name */}
            <label htmlFor="recording-name">Name</label>
            <input type="text" id="recording-name" ref={nameInputRef} />

            {/* Description */}
            <label
              htmlFor="recording-description"
              style={{ alignSelf: 'flex-start', height: '100%' }}
            >
              Description
            </label>
            <textarea id="recording-description" ref={descriptionRef} />
          </Grid>

          {/* Separate */}
          <Separator gap="3rem" />

          <span className="text-larger">Available Devices</span>
          <span className="block mt">
            <Alert
              type="info"
              message="Devices can be added after the recording has been created"
            />
          </span>
        </div>
      </div>
    </DialogContainer>
  );
};
