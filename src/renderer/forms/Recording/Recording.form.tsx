import React, { useState } from 'react';

// Headless UI
import { RadioGroup } from '@headlessui/react';

// Config file
import devices from '@configs/devices.json';

// Icon
import SensorIcon from '@icons/sensor.svg';
import SubmitButton from '@components/Form/SubmitButton.component';
import { setSensorStatus } from '@adapters/experimentAdapter';

const RecordingForm = () => {
  let [sensor, setSensor] = useState(0);

  // Sets the current sensor state to the global experimentData current sensor state
  const handleSave = () => {
    setSensorStatus(devices.devices[sensor]);
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
        <SubmitButton text="Save" onClick={handleSave} />
      </div>
    </div>
  );
};
export default RecordingForm;
