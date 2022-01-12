import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import { RadioGroup } from '@headlessui/react';

// Components
import SubmitButton from '@components/Form/SubmitButton.component';
import ListButton from '@components/Buttons/ListButton';

import { ProbeChannels } from '@utils/channels';

// Icon
import SensorIcon from '@icons/sensor.svg';
import ProbeIcon from '@icons/probe.svg';
import toast from 'react-hot-toast';
import { closeModal } from '@redux/ModalStateSlice';
import { CurrentProbe, setCurrentProbe } from '@redux/SensorStateSlice';

const SelectProbeForm = () => {
  const [devices, setDevices] = useState<any[] | null>(null);
  const [sensor, setSensor] = useState(0);
  const [probes, setProbes] = useState<any[] | null>(null);
  const [selectedProbe, setSelectedProbe] = useState<CurrentProbe | null>(null);
  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe as CurrentProbe
  );
  const dispatch = useAppDispatch();

  const detectedSensor = useAppSelector(
    (state) => state.sensorState.detectedSensor
  );

  useEffect(() => {
    (async () => {
      const allDevices = await window.api.invokeIPC(
        ProbeChannels.GetAllDevices
      );
      setDevices(allDevices);
    })();

    return () => window.api.removeListeners(ProbeChannels.GetAllDevices);
  }, []);

  useEffect(() => {
    console.log(sensor);
    (async () => {
      const probesOfDevice = await window.api.invokeIPC(
        ProbeChannels.GetAllProbesOfDevice,
        sensor
      );
      console.log(probesOfDevice);
      setProbes(probesOfDevice);
    })();
  }, [sensor]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submit
    const probe = await window.api.invokeIPC(
      ProbeChannels.SelectProbe,
      selectedProbe?.id
    );
    if (!probe) {
      toast.error(
        'Failed to change the probe. Please contact the system administrator'
      );
    }
    dispatch(setCurrentProbe(probe));
    toast.success(`Probe ${selectedProbe?.name} was selected successfully`);
    setTimeout(() => dispatch(closeModal()), 500);
  };

  return (
    <div className="w-full px-4">
      <div className="w-full">
        <form className="mt-2" onSubmit={handleSubmit}>
          <h3 className="mt-4 py-2 text-xl">Select a Device:</h3>
          <RadioGroup value={sensor} onChange={setSensor}>
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
          {probes && probes.length > 0 && (
            <>
              <h3 className="mt-4 py-2 text-xl">Select a Probe:</h3>
              {probes.map((probe: any) => (
                <ListButton
                  text={
                    probe.name + `${probe.isDefault === 1 ? ' (Default)' : ''}`
                  }
                  description={`Sampling Rate: ${probe.samplingRate}`}
                  icon={ProbeIcon}
                  isActive={probe.id === currentProbe.id}
                  onClick={() => {
                    setSelectedProbe(probe);
                  }}
                  time={probe.lastUpdate || undefined}
                  deleteOnClick={undefined}
                  key={probe.name + probe.id + 'select-probe'}
                />
              ))}
            </>
          )}

          <SubmitButton
            text="Select Probe"
            disabled={selectedProbe ? false : true}
          />
        </form>
      </div>
    </div>
  );
};
export default SelectProbeForm;
