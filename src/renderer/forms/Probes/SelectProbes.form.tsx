import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { RadioGroup } from '@headlessui/react';

// Components
import SubmitButton from '@components/Form/SubmitButton.component';
import ListButton from '@components/Buttons/ListButton';

import { ProbeChannels } from '@utils/channels';

// Icon
import SensorIcon from '@icons/sensor.svg';
import ProbeIcon from '@icons/probe.svg';
import toast from 'react-hot-toast';
import { CurrentProbe } from '@redux/SensorStateSlice';

import { devices } from '@electron/configs/devices';
import Button from '@components/Buttons/Button.component';

const SelectProbeForm = ({
  isSelectionOnly = false,
}: {
  isSelectionOnly?: boolean;
}) => {
  const [sensor, setSensor] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [probes, setProbes] = useState<any[] | null>(null);
  const [selectedProbe, setSelectedProbe] = useState<CurrentProbe | null>(null);
  const currentProbe = useAppSelector(
    (state) => state.global.probe?.currentProbe
  );
  const detectedSensor = useAppSelector(
    (state) => state.sensorState.detectedSensor
  );

  useEffect(() => {
    (async () => {
      const probesOfDevice = await window.api.invokeIPC(
        ProbeChannels.GetAllProbesOfDevice,
        sensor
      );
      setProbes(probesOfDevice);
    })();
  }, [sensor, currentProbe, refresh]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const probe = selectedProbe;

    // Handle form submit
    const result = await window.api.invokeIPC(
      ProbeChannels.SelectProbe,
      selectedProbe?.id
    );

    if (!result) {
      toast.error('Failed to change the current probe.');
      return;
    }
    toast.success(`Probe ${probe?.name} was selected successfully`);
  };

  const handleDeleteProbeBtn = async (probeId: number) => {
    const result = await window.api.invokeIPC(
      ProbeChannels.DeleteProbe,
      probeId
    );

    if (!result) {
      toast.error('Failed to delete the probe.');
      return;
    }
    setRefresh(!refresh);

    toast.success(`Probe was deleted successfully`);
  };

  const handleSetAsDefaultBtn = async (probeId: number) => {
    const result = await window.api.invokeIPC(
      ProbeChannels.SetProbeAsDefault,
      probeId
    );
    if (!result) {
      toast.error('Failed to set the probe as default.');
      return;
    }

    setRefresh(!refresh);
    toast.success(`Probe was set as default successfully`);
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
                <div className="relative w-full">
                  <ListButton
                    text={
                      probe.name +
                      `${probe.isDefault === 1 ? ' (Default)' : ''}`
                    }
                    description={`Sampling Rate: ${probe.samplingRate}`}
                    icon={ProbeIcon}
                    isActive={probe.id === currentProbe?.id}
                    onClick={() => {
                      setSelectedProbe(probe);
                    }}
                    time={probe.lastUpdate || undefined}
                    deleteOnClick={
                      isSelectionOnly
                        ? undefined
                        : () => handleDeleteProbeBtn(probe.id)
                    }
                    key={probe.name + probe.id + 'select-probe'}
                  />
                  {!isSelectionOnly && probe.isDefault !== 1 && (
                    <Button
                      type="button"
                      className="absolute right-20 top-1/2 z-40 -translate-y-1/2"
                      text="Set as Default"
                      onClick={() => handleSetAsDefaultBtn(probe.id)}
                    />
                  )}
                </div>
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
