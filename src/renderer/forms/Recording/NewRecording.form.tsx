import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@redux/hooks/hooks';
import { closeModal } from '@redux/ModalStateSlice';
import { changeAppState } from '@redux/AppStateSlice';

// Components
import NewRecordingInfo from './NewRecordingInfo.form';
import Button from '@components/Buttons/Button.component';
import SelectProbeForm from '@forms/Probes/SelectProbes.form';

import { ExperimentChannels } from '@utils/channels';
import { AppState } from '@utils/constants';

export enum Steps {
  RecordingInfo = 1,
  DeviceSelection = 2,
  ProbeInfo = 3,
}

const NewRecordingForm = () => {
  const [step, setStep] = useState(1);
  const [recordingInfo, setRecordingInfo] = useState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (recordingInfo) setStep(Steps.DeviceSelection);
  }, [recordingInfo]);

  const handleSubmit = async () => {
    if (!recordingInfo) {
      toast.error('Please enter recording information');
      return;
    }

    // Send the recording info to the controller
    const result = await window.api.invokeIPC(
      ExperimentChannels.NewRecording,
      recordingInfo
    );

    if (result) {
      requestAnimationFrame(() => dispatch(closeModal()));
      requestAnimationFrame(() => dispatch(changeAppState(AppState.RECORD)));
    }
  };

  return (
    <div>
      <div className="slideLeft w-full" hidden={step !== Steps.RecordingInfo}>
        <NewRecordingInfo setData={setRecordingInfo} />
      </div>
      <div className="slideLeft" hidden={step !== Steps.DeviceSelection}>
        <SelectProbeForm isSelectionOnly={true} />

        <span className="flex w-full items-center justify-between">
          <Button
            text="Previous"
            className="my-2"
            onClick={() => setStep(Steps.RecordingInfo)}
          />
          <Button
            text="Submit"
            className="my-2"
            isActive={true}
            onClick={handleSubmit}
          />
        </span>
      </div>
    </div>
  );
};
export default NewRecordingForm;
