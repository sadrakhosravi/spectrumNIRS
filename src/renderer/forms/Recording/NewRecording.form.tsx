import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { useAppDispatch } from '@redux/hooks/hooks';
import { closeModal } from '@redux/ModalStateSlice';
import { changeAppState } from '@redux/AppStateSlice';

// Components
import NewRecordingInfo from './NewRecordingInfo.form';
import Button from '@components/Buttons/Button.component';
import SelectProbeForm from '@forms/Probes/SelectProbes.form';

import { ExperimentChannels } from '@utils/channels';
import { AppState } from '@utils/constants';
import NewRecordingSettings from './NewRecordingSettings.form';

export enum Steps {
  RecordingInfo = 1,
  ProbeSelection = 2,
  RecordingSetting = 3,
}

const NewRecordingForm = () => {
  const [step, setStep] = useState(1);
  const [formError, setFormError] = useState('');
  const dispatch = useAppDispatch();
  const methods = useForm();

  const handleFormSubmit = async (data: any) => {
    // Check TOI settings
    if (data.TOI?.threshold) {
      if (
        !data.TOI?.minimum ||
        !data.TOI?.maximum ||
        data.TOI.minimum >= data.TOI.maximum
      ) {
        setFormError('TOI threshold minimum and maximum range error');
        return;
      }
    }

    const settingsObj = {
      TOIThreshold: false,
    };

    // Add the TOI Threshold settings
    settingsObj.TOIThreshold = data.TOI;

    // Send the recording info to the controller
    const result = await window.api.invokeIPC(ExperimentChannels.NewRecording, {
      data: data.recording,
      settings: settingsObj,
    });

    if (result) {
      requestAnimationFrame(() => dispatch(closeModal()));
      setTimeout(() => dispatch(changeAppState(AppState.RECORD)), 300);
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
          {/* Recording Info */}
          <div
            className="slideLeft w-full"
            hidden={step !== Steps.RecordingInfo}
          >
            <NewRecordingInfo />
            <div className="w-full text-center">
              <Button
                text="Next"
                className="my-2"
                isActive={true}
                onClick={() => setStep(step + 1)}
              />
            </div>
          </div>

          {/* Recording Settings */}
          <div className="slideLeft" hidden={step !== Steps.RecordingSetting}>
            <NewRecordingSettings />
            {formError && <div className="z-50 my-2 text-red">{formError}</div>}

            <span className="mt-4 flex w-full items-center justify-between">
              <Button
                text="Previous"
                className="my-2"
                onClick={() => setStep(step - 1)}
              />
              <Button
                type="submit"
                text="Create Recording"
                className="my-2"
                isActive={true}
              />
            </span>
          </div>
        </form>

        {/* This form should be last because it contains another <form> tag and
            is not related to the wizard steps
        */}
        <div className="slideLeft" hidden={step !== Steps.ProbeSelection}>
          <SelectProbeForm isSelectionOnly={true} />

          <span className="flex w-full items-center justify-between">
            <Button
              text="Previous"
              className="my-2"
              onClick={() => setStep(step - 1)}
            />
            <Button
              text="Next"
              className="my-2"
              isActive={true}
              onClick={() => setStep(step + 1)}
            />
          </span>
        </div>
      </FormProvider>
    </div>
  );
};
export default NewRecordingForm;
