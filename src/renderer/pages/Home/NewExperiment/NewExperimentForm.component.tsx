import React from 'react';
import { useForm } from 'react-hook-form';

// Components
import InputField from '@components/Form/InputField.component';
import DateField from '@components/Form/DateField.component';
import TextAreaField from '@components/Form/TextAreaField.component';

// Redux
import { useDispatch } from 'react-redux';
import { setExperimentInfo } from '@redux/ExperimentInfoSlice';
import { changeAppState } from '@redux/AppStateSlice';

/**
 * Renders the new experiment form an allows user to create or cancel.
 * @returns Experiment form.
 */
const NewExperimentForm = () => {
  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();

  const onSubmit = (data: any) => {
    dispatch(setExperimentInfo(data));
    dispatch(changeAppState('record'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl text-medium pb-3">Experiment Information</h3>
      <label className="text-sm inline-block w-1/2 pr-2">
        <span className="block pb-1">Experiment Name:</span>
        <InputField register={register('experimentName')} />
      </label>
      <label className="text-sm inline-block w-1/2 pl-2 ">
        <span className="block pb-1">Date:</span>
        <DateField register={register('experimentDate')} />
      </label>
      <label className="text-sm inline-block w-full mt-2">
        <span className="block pb-1">Description:</span>
        <TextAreaField register={register('experimentDescription')} />
      </label>

      <h3 className="text-xl text-medium pb-3 mt-6">Patient Information</h3>
      <label className="text-sm inline-block w-1/2 pr-2">
        <span className="block pb-1">Patient Name:</span>
        <InputField register={register('patientName')} />
      </label>
      <label className="text-sm inline-block w-1/2 pl-2 ">
        <span className="block pb-1">DOB:</span>
        <DateField register={register('dob')} />
      </label>
      <label className="text-sm inline-block w-full mt-2">
        <span className="block pb-1">Description:</span>
        <TextAreaField register={register('patientDescription')} />
      </label>
      <div className="block text-center">
        <button
          type="submit"
          className="inline-block justify-center mt-6 px-4 py-2 text-sm border border-transparent rounded-md border-white  hover:bg-accent hover:border-accent transition"
        >
          Create Experiment
        </button>
      </div>
    </form>
  );
};
export default NewExperimentForm;
