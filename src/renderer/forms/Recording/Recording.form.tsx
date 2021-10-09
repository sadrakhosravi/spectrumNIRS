import React, { useState } from 'react';

// Headless UI
import { RadioGroup } from '@headlessui/react';

// Config file
import deviceConfigs from '@configs/devices.json';

// Icon
import SensorIcon from '@icons/sensor.svg';

const RecordingForm = () => {
  let [sensor, setSensor] = useState('');

  Object.entries(deviceConfigs).forEach((device: any) => {
    console.log(device[1].deviceName);
  });

  return (
    <div className="w-full px-4 py-10">
      <div className="w-full">
        <RadioGroup value={sensor} onChange={setSensor}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
            {Object.entries(deviceConfigs).map((device: any) => (
              <RadioGroup.Option value={device[1].deviceName}>
                {({ checked }) => (
                  <>
                    <div
                      className={`${
                        checked && 'ring-2 ring-accent'
                      } w-32 h-32 bg-grey2  rounded-md flex flex-col items-center justify-center`}
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
      </div>
    </div>
  );
};
export default RecordingForm;
