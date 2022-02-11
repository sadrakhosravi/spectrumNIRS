import React from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { useForm } from 'react-hook-form';
import { setPatientData } from '@redux/ExperimentDataSlice';
import { closeModal, openModal } from '@redux/ModalStateSlice';

// Components
import InputField from '@components/Form/InputField.component';
import DateField from '@components/Form/DateField.component';
import TextAreaField from '@components/Form/TextAreaField.component';
import SubmitButton from '@components/Form/SubmitButton.component';

// Interfaces
import { INewPatientData } from 'interfaces/interfaces';
import { ExperimentChannels } from '@utils/channels';
import { ModalConstants } from '@utils/constants';

const PatientForm = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const patient: INewPatientData = data.patient;
    // Send the prepared data to the controller
    const newPatient = await window.api.invokeIPC(
      ExperimentChannels.NewPatient,
      patient
    );

    if (newPatient) {
      dispatch(setPatientData(newPatient));
      dispatch(closeModal());
      dispatch(openModal(ModalConstants.NEWRECORDING));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <SubmitButton text={'Create Patient'} />
    </form>
  );
};
export default PatientForm;
