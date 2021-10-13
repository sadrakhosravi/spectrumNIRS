import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Headless UI
import { RadioGroup } from '@headlessui/react';

// Config file
import devices from '@configs/devices.json';

// Components
import InputField from '@components/Form/InputField.component';
import SubmitButton from '@components/Form/SubmitButton.component';

// Adapters
import { setSensorStatus } from '@adapters/experimentAdapter';

// Icon
import SensorIcon from '@icons/sensor.svg';

const RecordingForm = () => {
  let [sensor, setSensor] = useState(0);
  const { register, handleSubmit } = useForm();

  // Sets the current sensor state to the global experimentData current sensor state

  type FormData = {
    sensor: {
      channels: string;
      samplingRate: string;
    };
  };

  // Handle form submit
  const onSubmit = (formData: FormData) => {
    const samplingRate = parseInt(formData.sensor.samplingRate);
    const channels = formData.sensor.channels.split(', ');
    const currentSensor = devices.devices[sensor];
    currentSensor.samplingRate = samplingRate;
    currentSensor.channels = channels;
    console.log(currentSensor);
    setSensorStatus(currentSensor);
  };

  return (
    <div className="w-full px-4 pt-2 ">
      <div className="w-full">
        <h3 className="py-4 text-xl">Select a sensor:</h3>
        <RadioGroup value={sensor} onChange={setSensor}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="grid grid-cols-4 gap-6">
            {devices.devices.map((device: any) => (
              <RadioGroup.Option
                value={device.id}
                disabled={device.id > 0 && true}
                key={device.id}
              >
                {({ checked, disabled }) => (
                  <>
                    <div
                      className={`${
                        checked && 'ring-2 ring-accent'
                      } w-full h-32 bg-grey2 rounded-md flex flex-col items-center justify-center cursor-pointer ${
                        disabled && 'bg-light bg-opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <img
                        src={SensorIcon}
                        width="48px"
                        height="48px"
                        alt="Sensor"
                      />
                      <p className="mt-2">{device.name}</p>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
        <h3 className="mt-8  text-xl">Sensor settings:</h3>
        <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
          <label className="text-sm inline-block w-full mt-2">
            <span className="block pb-1">Sampling Rate:</span>
            <InputField
              defaultValue={devices.devices[sensor].samplingRate}
              type="number"
              register={register('sensor.samplingRate')}
            />
          </label>
          <label className="text-sm inline-block w-full mt-2">
            <span className="block pb-1">Channels:</span>
            <InputField
              defaultValue={devices.devices[sensor].channels.join(', ')}
              type="text"
              register={register('sensor.channels')}
            />
          </label>
          <SubmitButton text="Save" />
        </form>
      </div>
    </div>
  );
};
export default RecordingForm;
