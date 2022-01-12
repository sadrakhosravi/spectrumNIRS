import React, { useEffect, useState } from 'react';
import { ProbeChannels, RecordChannels } from '@utils/channels';
import { useAppSelector } from '@redux/hooks/hooks';

//Components
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '../../components/Widget/Widget.component';

// Icons
import BorderButton from '@components/Buttons/BorderButton.component';

//Renders the filter widget on the sidebar
const Intensities = () => {
  const [intensities, setIntensities] = useState<null | number[]>(null);
  const [status, setStatus] = useState('');
  const [_defaultIntensities, setDefaultIntensities] = useState<any>(null);
  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe
  );

  const loadIntensities = async () => {
    const probeConfigs = await window.api.invokeIPC(
      ProbeChannels.GetProbeIntensities
    );
    setIntensities(null);
    setIntensities(
      (_prevInt) => probeConfigs.intensities || probeConfigs.defaultIntensities
    );
    setDefaultIntensities(probeConfigs.defaultIntensities);
  };

  useEffect(() => {
    loadIntensities();
  }, [currentProbe]);

  console.log(intensities);

  const handleRangeSliderChange = (event: any) => {
    const id = event.target.id;
    const element = document.getElementById(`${id}-value`) as HTMLInputElement;
    element.value = event.target.value;
  };

  const handleInputChange = (event: any) => {
    const id = event.target.id.split('-')[0];
    const element = document.getElementById(`${id}`) as HTMLInputElement;
    element.value = event.target.value;

    sendDataToController();
  };

  const sendDataToController = async () => {
    const newIntensities: any[] = [];
    intensities &&
      intensities.forEach((_, i) => {
        const currentLED = document.getElementById(
          `LED${i}`
        ) as HTMLInputElement;
        newIntensities.push(currentLED.value);
      });
    newIntensities.push('HIGH');
    newIntensities.push('100');
    console.log(newIntensities);
    const result = await window.api.invokeIPC(
      RecordChannels.SyncGain,
      newIntensities
    );
    if (result) {
      setStatus('Sent to the device successfully');
    } else {
      setStatus('Failed to contact the device');
    }
  };

  const saveIntensities = async () => {
    const newIntensities: string[] = [];
    intensities &&
      intensities.forEach((_, i) => {
        const currentLED = document.getElementById(
          `LED${i}`
        ) as HTMLInputElement;
        newIntensities.push(currentLED.value);
      });

    const result = await window.api.invokeIPC(
      ProbeChannels.UpdateProbeIntensities,
      newIntensities
    );
    if (result.affected) {
      setStatus('Saved successfully');
    }
  };

  return (
    <>
      {intensities && (
        <Widget span="3">
          <Tabs>
            <Tabs.Tab label="Intensities">
              <div>
                <div className="mb-4 text-white text-opacity-70">
                  Current Probe: {currentProbe?.name}
                </div>
                {intensities &&
                  intensities.map((intensity: number, i: number) => (
                    <div
                      className="mb-4 flex items-center group"
                      key={`LED${i}`}
                    >
                      <label
                        className="inline-block w-3/12 group-hover:text-accent"
                        htmlFor={`LED${i}`}
                      >
                        LED{i + 1}
                      </label>
                      <input
                        id={`LED${i}`}
                        className="inline-block w-9/12"
                        type="range"
                        min="1"
                        max="180"
                        defaultValue={intensity}
                        onMouseUp={sendDataToController}
                        onChange={handleRangeSliderChange}
                      />
                      <input
                        id={`LED${i}-value`}
                        className="absolute right-0 -bottom-4 text-base w-12 bg-transparent"
                        type="number"
                        onChange={handleInputChange}
                        defaultValue={intensity}
                      ></input>
                    </div>
                  ))}
                <div className="mt-7 text-right">
                  <BorderButton text="Save" onClick={saveIntensities} />
                </div>
              </div>

              <span className="text-base">Status: {status}</span>
            </Tabs.Tab>
          </Tabs>
        </Widget>
      )}
    </>
  );
};

export default Intensities;
