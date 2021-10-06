import React from 'react';
import { useForm } from 'react-hook-form';

// Components
import InputField from '@components/Form/InputField.component';
import DateField from '@components/Form/DateField.component';
import TextAreaField from '@components/Form/TextAreaField.component';
import SubmitButton from '@components/Form/SubmitButton.component';

// Controllers
import { newExperiment } from '@rendererController/experimentController';
/**
 * Renders the new experiment form an allows user to create or cancel.
 * @returns Experiment form.
 */
const NewExperimentForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    newExperiment(data);
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
        <span className="block pb-1">Date:</span>
        <DateField register={register('experiment.date', { required: true })} />
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
        <span className="block pb-1">Date of Birth:</span>
        <DateField register={register('patient.dob', { required: true })} />
      </label>
      <label className="text-sm inline-block w-full mt-2">
        <span className="block pb-1">Description:</span>
        <TextAreaField register={register('patient.description')} />
      </label>
      <SubmitButton text={'Create a New Experiment'} />
    </form>
  );
};
export default NewExperimentForm;
