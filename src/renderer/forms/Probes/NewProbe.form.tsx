import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import { RadioGroup } from '@headlessui/react';

// Components
import SubmitButton from '@components/Form/SubmitButton.component';
import InputField from '@components/Form/InputField.component';

// Icon
import SensorIcon from '@icons/sensor.svg';
import toast from 'react-hot-toast';
import { closeModal } from '@redux/ModalStateSlice';
import SelectField, {
  SelectOption,
} from '@components/Form/SelectField.component';

import { devices } from '@electron/configs/devices';
import { ProbeChannels } from '@utils/channels';

type FormDataProps = {
  name: string;
  samplingRate: string | number;
};

const NewProbeForm = () => {
  const [currDevice, setCurrDevice] = useState(0);
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();

  const detectedSensor = useAppSelector(
    (state) => state.sensorState.detectedSensor
  );

  const handleFormSubmit = async (data: FormDataProps) => {
    // Process form data
    const deviceId = currDevice;
    const samplingRate = ~~data.samplingRate;

    const processedData = {
      name: data.name,
      samplingRate,
      intensities: devices[currDevice].defaultIntensities,
      preGain: 'HIGH',
      gain: 0,
      deviceId,
    };

    const result = await window.api.invokeIPC(
      ProbeChannels.NewProbe,
      processedData
    );

    if (!result) {
      toast.error(`Operation failed! Database error occurred`);
      return;
    }

    toast.success(
      `Probe ${processedData.name} was created and set as the current probe successfully.`
    );
    dispatch(closeModal());
  };

  return (
    <div className="w-full px-4">
      <div className="w-full">
        <h3 className="mt-4 py-2 text-xl">Select a Device:</h3>
        <RadioGroup value={currDevice} onChange={setCurrDevice}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="grid grid-cols-2 gap-6">
            {devices &&
              devices.map((device: any) => (
                <RadioGroup.Option
                  value={device.id}
                  disabled={device.name.includes('Beast')}
                  key={device.id + device.name}
                >
                  {({ checked, disabled }) => (
                    <>
                      <div
                        className={`${
                          checked && 'ring-2 ring-accent'
                        } flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-grey2 ${
                          disabled &&
                          'cursor-not-allowed bg-light bg-opacity-40'
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
                          Status:
                          {detectedSensor?.name === device.name ? '✅' : '❌'}
                        </p>
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
          </div>
        </RadioGroup>

        <h3 className="mt-4 py-4 text-xl">Create a Probe:</h3>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid auto-rows-auto grid-cols-[150px_1fr] items-center gap-x-2 gap-y-4 pb-4">
            <div>Name</div>
            <div>
              <InputField
                placeholder="Please enter a name for the probe"
                register={register('name', { required: true })}
              />
            </div>
            <div>Sampling Rate</div>
            <div>
              <SelectField
                register={register('samplingRate', {
                  required: true,
                  value: devices[currDevice].defaultSamplingRate,
                })}
              >
                {devices[currDevice].supportedSamplingRates.map(
                  (samplingRate) => (
                    <SelectOption
                      value={samplingRate}
                      name={samplingRate.toString()}
                      key={samplingRate + 'samplingRate'}
                    />
                  )
                )}
              </SelectField>
            </div>
            <div>Intensities</div>
            <div>
              <InputField
                title="Can be changed in the probe calibration section"
                defaultValue={devices[currDevice].defaultIntensities.join(',')}
                disabled
              />
            </div>

            <div>Channels</div>
            <div className="grid w-full auto-cols-auto grid-flow-col gap-3">
              {devices[currDevice].defaultChannels.map((channel) => (
                <InputField
                  defaultValue={channel}
                  disabled
                  title={'This section will be available in future updates'}
                  key={channel + 'channel'}
                />
              ))}
            </div>
          </div>
          <SubmitButton text="Create Probe" />
        </form>
      </div>
    </div>
  );
};
export default NewProbeForm;
