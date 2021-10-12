import React, { useState } from 'react';

// Headless UI
import { RadioGroup } from '@headlessui/react';

// Config file
import deviceConfigs from '@configs/devices.json';

// Icon
import SensorIcon from '@icons/sensor.svg';
import SubmitButton from '@components/Form/SubmitButton.component';

const RecordingForm = () => {
  let [sensor, setSensor] = useState(1);

  const handleSave = () => {
    console.log(sensor);
  };

  return (
    <div className="w-full px-4 pt-2 ">
      <div className="w-full">
        <h3 className="py-4 text-xl">Select a sensor:</h3>
        <RadioGroup value={sensor} onChange={setSensor}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="grid grid-cols-4 gap-6">
            {Object.entries(deviceConfigs).map((device: any) => (
              <RadioGroup.Option
                value={device[1].id}
                disabled={device[1].id > 1 && true}
              >
                {({ checked, disabled }) => (
                  <>
                    <div
                      className={`${
                        checked && 'ring-2 ring-accent'
                      } w-full h-32 bg-grey2 rounded-md flex flex-col items-center justify-center cursor-pointer ${
                        disabled && 'bg-light bg-opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <img
                        src={SensorIcon}
                        width="48px"
                        height="48px"
                        alt="Sensor"
                      />
                      <p className="mt-2">{device[1].deviceName}</p>
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
