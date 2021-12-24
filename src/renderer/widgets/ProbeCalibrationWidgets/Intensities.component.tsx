import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { ProbeChannels, RecordChannels } from '@utils/channels';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '../../components/Widget/Widget.component';
import { setSensorIntensities } from '@redux/SensorStateSlice';

// Icons
import BorderButton from '@components/Buttons/BorderButton.component';

//Renders the filter widget on the sidebar
const Intensities = ({ setLoading }: any) => {
  const [intensities, setIntensities] = useState<any>(null);
  const [LEDs, setLEDs] = useState<any>(null);
  const [_defaultIntensities, setDefaultIntensities] = useState<any>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const probeIntensities = await window.api.invokeIPC(
        ProbeChannels.GetProbeIntensities
      );
      console.log(probeIntensities);
      setIntensities(
        probeIntensities.savedIntensities || probeIntensities.defaultIntensities
      );
      setLEDs(probeIntensities.LEDs);
      setDefaultIntensities(probeIntensities.defaultIntensities);
      setLoading(false);
    })();
  }, []);

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
      LEDs.forEach((LED: string) => {
        const currentLED = document.getElementById(LED) as HTMLInputElement;
        newIntensities.push(currentLED.value);
      });
    newIntensities.push('HIGH');
    newIntensities.push('100');
    const result = await window.api.invokeIPC(
      RecordChannels.SyncGain,
      newIntensities
    );
    dispatch(setSensorIntensities(newIntensities));
    console.log(newIntensities);
    if (result) {
      (document.getElementById('LEDStatus') as HTMLSpanElement).innerText =
        'Successful';
    } else {
      (document.getElementById('LEDStatus') as HTMLSpanElement).innerText =
        'Failed';
    }
  };

  const saveIntensities = async () => {
    const newIntensities: string[] = [];
    intensities &&
      LEDs.forEach((LED: string) => {
        const currentLED = document.getElementById(LED) as HTMLInputElement;
        newIntensities.push(currentLED.value);
      });

    const result = await window.api.invokeIPC(
      ProbeChannels.UpdateProbeIntensities,
      newIntensities
    );
    if (result.affected) {
      (document.getElementById('LEDStatus') as HTMLElement).innerText =
        'Saved Successfully';
    }
  };

  return (
    <Widget span="3">
      <Tabs>
        <Tabs.Tab label="Intensities">
          <div>
            <div
              className="mb-4 text-white text-opacity-60 cursor-not-allowed"
              title="Adding and removing probes feature will be added in the upcoming updates"
            >
              Current Probe: Probe 1
            </div>
            {LEDs &&
              LEDs.map((LED: string, i: number) => (
                <div className="mb-4 flex items-center group" key={LED}>
                  <label
                    className="inline-block w-3/12 group-hover:text-accent"
                    htmlFor={LED}
                  >
                    {LED}
                  </label>
                  <input
                    id={`${LED}`}
                    className="inline-block w-9/12"
                    type="range"
                    min="1"
                    max="180"
                    defaultValue={intensities[i]}
                    onMouseUp={sendDataToController}
                    onChange={handleRangeSliderChange}
                  />
                  <input
                    id={`${LED}-value`}
                    className="absolute right-0 -bottom-4 text-base w-12 bg-transparent"
                    type="number"
                    onChange={handleInputChange}
                    defaultValue={intensities[i]}
                  ></input>
                </div>
              ))}
            <div className="mt-7 text-right">
              <BorderButton text="Save" onClick={saveIntensities} />
            </div>
          </div>
          <span className="text-base">
            Status: <span id="LEDStatus"></span>
          </span>
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};

export default withLoading(Intensities, 'Contacting Hardware ...');
