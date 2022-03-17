import React, { useEffect, useState } from 'react';
import { ProbeChannels, RecordChannels } from '@utils/channels';
import { useAppSelector } from '@redux/hooks/hooks';

//Components
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '../../components/Widget/Widget.component';

// Icons
import BorderButton from '@components/Buttons/BorderButton.component';
import DisabledOverlay from '@components/Overlay/DisabledOverlay.component';

//Renders the filter widget on the sidebar
const Intensities = () => {
  const [intensities, setIntensities] = useState<null | number[]>(null);
  const [status, setStatus] = useState('');
  const [_defaultIntensities, setDefaultIntensities] = useState<any>(null);
  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe
  );

  const isCalibrating = useAppSelector(
    (state) => state.global.recordState?.isCalibrating
  );

  // Loads the current probe intensities from the DB
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

  // Load probe intensities whenever a new probe is selected
  useEffect(() => {
    loadIntensities();
  }, [currentProbe]);

  // Handles the range slider change of value
  const handleRangeSliderChange = (event: any) => {
    const id = event.target.id;
    const element = document.getElementById(`${id}-value`) as HTMLInputElement;
    element.value = event.target.value;
  };

  // Handles the input change of value

  const handleInputChange = (event: any) => {
    const id = event.target.id.split('-')[0];
    const element = document.getElementById(`${id}`) as HTMLInputElement;
    element.value = event.target.value;

    sendDataToController();
  };

  // Send the data to controller
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
    const result = await window.api.invokeIPC(
      RecordChannels.SyncIntensitiesAndGain,
      newIntensities
    );
    if (result) {
      setStatus('Sent to the device successfully');
    } else {
      setStatus('Failed to contact the device');
    }
  };

  // Asks the controller to save the intensities in the DB
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
              <>
                {!isCalibrating && (
                  <DisabledOverlay message='Press the "Start" button to enable this section' />
                )}
              </>
              <div>
                <div className="mb-4 text-white text-opacity-70">
                  Current Probe: {currentProbe?.name}
                </div>
                {intensities &&
                  intensities.map((intensity: number, i: number) => (
                    <div
                      className="group mb-4 flex items-center"
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
                        className="absolute right-0 -bottom-4 w-12 bg-transparent text-base"
                        type="number"
                        min="1"
                        max="180"
                        onChange={handleInputChange}
                        defaultValue={intensity}
                      ></input>
                    </div>
                  ))}
                <div className="mt-7 text-right">
                  <BorderButton text="Save" onClick={saveIntensities} />
                </div>
              </div>

              <span className="absolute bottom-5 left-3 text-base">
                Status: {status}
              </span>
            </Tabs.Tab>
          </Tabs>
        </Widget>
      )}
    </>
  );
};

export default Intensities;
