import * as React from 'react';

// Styles
import styles from './createRecording.module.scss';

// Components
import { DialogContainer } from '../../Elements/DialogContainer';
import { Button } from '../../Elements/Buttons';

import { Grid } from '../../Elements/Grid';
import { Separator } from '../../Elements/Separator';
import { Alert } from '../../Elements/Alert';

// View Models
import { appRouterVM, recordingVM } from '@store';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';
import { SelectableCard } from '/@/components/Elements/SelectableCard';
// import { AvailableDevices } from '../../Device/AvailableDevices/AvailableDevices';

export const CreateNewRecording = () => {
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const [sensor, setSensor] = React.useState<'v5' | 'v6'>('v5');

  // Parses and sends the UI information to the view model
  const handleCreateRecordingClick = React.useCallback(() => {
    const name = nameInputRef.current?.value as string;
    const description = descriptionRef.current?.value as string;

    console.log(sensor);

    if (!name) {
      nameInputRef.current?.focus();
      return;
    }

    // Ask view model to create the recording
    recordingVM.createNewRecording(name, sensor, description);
  }, [sensor]);

  return (
    <DialogContainer
      title="Create a new recording"
      actionButtons={
        <>
          <Button text="Discard" />
          <Button
            text="Create Recording"
            onClick={handleCreateRecordingClick}
          />
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

          <span className="text-larger mb block">Available Modules</span>
          <div className={styles.AvailableDevices}>
            <SelectableCard
              text="V5 Sensor"
              value="v5"
              isSelected={sensor === 'v5'}
              setter={() => setSensor('v5')}
            />
            <SelectableCard
              text="V6 Sensor"
              value="v6"
              isSelected={sensor === 'v6'}
              setter={() => setSensor('v6')}
            />
          </div>
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
