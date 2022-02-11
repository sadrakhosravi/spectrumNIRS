import React from 'react';
import { useForm } from 'react-hook-form';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';

// Config file

// Components
import InputField from '@components/Form/InputField.component';
import DateField from '@components/Form/DateField.component';
import TextAreaField from '@components/Form/TextAreaField.component';
import Button from '@components/Buttons/Button.component';

// Adapters
import getCurrentDate from '@lib/helper/getCurrentDate';

type NewRecordingInfoProps = {
  setData: React.Dispatch<React.SetStateAction<any>>;
};

const NewRecordingInfo = ({ setData }: NewRecordingInfoProps) => {
  const { register, handleSubmit } = useForm();

  // Sets the current sensor state to the global experimentData current sensor state

  type FormData = {
    sensor: {
      channels: string;
      samplingRate: string;
    };
    recording: INewRecordingData;
  };

  // Handle form submit
  const onSubmit = (formData: FormData) => {
    setData(formData.recording);
  };

  return (
    <div className="w-full px-4 pt-2 ">
      <div className="w-full">
        <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="py-2 text-xl">Recording Information:</h3>

          <label className="text-sm inline-block w-1/2 mt-2 pr-2">
            <span className="block pb-1">Name:</span>
            <InputField
              type="text"
              register={register('recording.name', { required: true })}
            />
          </label>
          <label className="text-sm inline-block w-1/2 mt-2 pl-2">
            <span className="block pb-1">Date:</span>
            <DateField
              type="text"
              register={register('recording.date', {
                required: true,
                value: getCurrentDate(),
              })}
            />
          </label>
          <label className="text-sm inline-block w-full mt-2">
            <span className="block pb-1">Description:</span>
            <TextAreaField
              type="text"
              register={register('recording.description')}
            />
          </label>
          <span className="block w-full text-center">
            <Button
              type="submit"
              text="Next"
              className="my-2"
              isActive={true}
            />
          </span>
        </form>
      </div>
    </div>
  );
};
export default NewRecordingInfo;
