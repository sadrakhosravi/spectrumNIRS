import React from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { ExperimentChannels } from '@utils/channels';
import {
  setExperimentData,
  resetRecordingData,
} from '@redux/ExperimentDataSlice';
import { closeModal, openModal } from '@redux/ModalStateSlice';

import { useForm } from 'react-hook-form';
import getCurrentDate from '@lib/helper/getCurrentDate';

// Components
import InputField from '@components/Form/InputField.component';
import DateField from '@components/Form/DateField.component';
import TextAreaField from '@components/Form/TextAreaField.component';
import SubmitButton from '@components/Form/SubmitButton.component';

import { ModalConstants } from '@utils/constants';

const ExperimentForm = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    // Create a new experiment and await the result
    const newExperiment = await window.api.invokeIPC(
      ExperimentChannels.NewExp,
      data
    );

    if (newExperiment) {
      dispatch(setExperimentData(newExperiment));
      dispatch(resetRecordingData());
      dispatch(closeModal());
      dispatch(openModal(ModalConstants.NEWRECORDING));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl text-medium pb-3">Experiment Information</h3>
      <label className="text-sm inline-block w-1/2 pr-2">
        <span className="block pb-1">Experiment Name:</span>
        <InputField
          register={register('experiment.name', { required: true })}
        />
      </label>
      <label className="text-sm inline-block w-1/2 pl-2 ">
        <span className="block pb-1">Date (MM-DD-YYY):</span>
        <DateField
          register={register('experiment.date', {
            required: true,
            value: getCurrentDate(),
          })}
        />
      </label>
      <label className="text-sm inline-block w-full mt-2">
        <span className="block pb-1">Description:</span>
        <TextAreaField register={register('experiment.description')} />
      </label>

      <h3 className="text-xl text-medium pb-3 mt-6">Patient Information</h3>
      <label className="text-sm inline-block w-1/2 pr-2">
        <span className="block pb-1">Patient Name:</span>
        <InputField register={register('patient.name', { required: true })} />
      </label>
      <label className="text-sm inline-block w-1/2 pl-2 ">
        <span className="block pb-1">Date of Birth (MM-DD-YYY):</span>
        <DateField register={register('patient.dob', { required: true })} />
      </label>
      <label className="text-sm inline-block w-full mt-2">
        <span className="block pb-1">Description:</span>
        <TextAreaField register={register('patient.description')} />
      </label>
      <SubmitButton text={'Create Experiment'} />
    </form>
  );
};
export default ExperimentForm;
