import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

import { RadioGroup } from '@headlessui/react';

import SensorIcon from '@icons/sensor.svg';

import { devices } from '@electron/configs/devices';
import { ProbeChannels } from '@utils/channels';

const NewRecordingDevice = () => {
  const [_probes, setProbes] = useState(null);
  const [sensor, setSensor] = useState(1);

  const detectedSensor = useAppSelector(
    (state) => state.sensorState.detectedSensor
  );

  useEffect(() => {
    (async () => {
      const allProbes = await window.api.invokeIPC(ProbeChannels.GetAllDevices);
      console.log(allProbes);
      setProbes(allProbes);
    })();
  }, []);

  return (
    <>
      <h3 className="mt-4 py-2 text-xl">Select a device:</h3>
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
                      disabled && 'bg-light bg-opacity-40 cursor-not-allowed'
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
    </>
  );
};
export default NewRecordingDevice;
