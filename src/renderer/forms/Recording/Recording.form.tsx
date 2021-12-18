import React, { useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { useForm } from 'react-hook-form';
import { RadioGroup } from '@headlessui/react';

// Interfaces
import { INewRecordingData } from 'interfaces/interfaces';

// Config file
import { devices } from '@electron/configs/devices';

// Components
import InputField from '@components/Form/InputField.component';
import SubmitButton from '@components/Form/SubmitButton.component';
import DateField from '@components/Form/DateField.component';
import TextAreaField from '@components/Form/TextAreaField.component';

// Adapters
import { newRecording, setSensorStatus } from '@adapters/experimentAdapter';

// Icon
import SensorIcon from '@icons/sensor.svg';

const RecordingForm = () => {
  const [sensor, setSensor] = useState(0);
  const { register, handleSubmit } = useForm();

  const detectedSensor = useAppSelector(
    (state) => state.sensorState.detectedSensor
  );

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
    const currentSensor = devices[sensor];
    newRecording(formData.recording);
    setSensorStatus(currentSensor);
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
              register={register('recording.date', { required: true })}
            />
          </label>
          <label className="text-sm inline-block w-full mt-2">
            <span className="block pb-1">Description:</span>
            <TextAreaField
              type="text"
              register={register('recording.description')}
            />
          </label>

          <h3 className="mt-4 py-2 text-xl">Select a sensor:</h3>
          <RadioGroup value={sensor} onChange={setSensor}>
            <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
            <div className="grid grid-cols-2 gap-6">
              {devices.map((device: any) => (
                <RadioGroup.Option
                  value={device.id}
                  disabled={device.name.includes('Beast')}
                  key={device.id}
                >
                  {({ checked, disabled }) => (
                    <>
                      <div
                        className={`${
                          checked && 'ring-2 ring-accent'
                        } w-full h-20 bg-grey2 rounded-md flex flex-col items-center justify-center cursor-pointer ${
                          disabled &&
                          'bg-light bg-opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <img
                          src={SensorIcon}
                          width="28px"
                          height="28px"
                          alt="Sensor"
                        />
                        <p className="mt-2">{device.name}</p>
                        <p className="absolute right-2 top-1">
                          Status:{' '}
                          {detectedSensor?.name === device.name ? '✅' : '❌'}
                        </p>
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>

          <SubmitButton text="Create Recording" />
        </form>
      </div>
    </div>
  );
};
export default RecordingForm;
