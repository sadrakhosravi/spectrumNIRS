import React from 'react';
import { useFormContext } from 'react-hook-form';

// Config file

// Components
import InputField from '@components/Form/InputField.component';
import DateField from '@components/Form/DateField.component';
import TextAreaField from '@components/Form/TextAreaField.component';

// Adapters
import getCurrentDate from '@lib/helpers/getCurrentDate';

type NewRecordingInfoProps = {};

const NewRecordingInfo = (_props: NewRecordingInfoProps) => {
  const { register } = useFormContext();

  return (
    <div className="w-full px-4 pt-2 ">
      <div className="w-full">
        <h3 className="py-2 text-xl">Recording Information:</h3>

        <label className="mt-2 inline-block w-1/2 pr-2 text-sm">
          <span className="block pb-1">Name:</span>
          <InputField
            type="text"
            register={register('recording.name', { required: true })}
          />
        </label>
        <label className="mt-2 inline-block w-1/2 pl-2 text-sm">
          <span className="block pb-1">Date:</span>
          <DateField
            type="text"
            register={register('recording.date', {
              required: true,
              value: getCurrentDate(),
            })}
          />
        </label>
        <label className="mt-2 inline-block w-full text-sm">
          <span className="block pb-1">Description:</span>
          <TextAreaField
            type="text"
            register={register('recording.description')}
          />
        </label>
      </div>
    </div>
  );
};
export default NewRecordingInfo;
