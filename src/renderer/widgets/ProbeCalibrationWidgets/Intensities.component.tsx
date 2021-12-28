import React, { useEffect, useState } from 'react';
import { ProbeChannels, RecordChannels } from '@utils/channels';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '../../components/Widget/Widget.component';

// Icons
import BorderButton from '@components/Buttons/BorderButton.component';

//Renders the filter widget on the sidebar
const Intensities = ({ setLoading }: any) => {
  const [intensities, setIntensities] = useState<null | number[]>(null);
  const [_defaultIntensities, setDefaultIntensities] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const probeConfigs = await window.api.invokeIPC(
        ProbeChannels.GetProbeIntensities
      );
      setIntensities(
        probeConfigs.intensities || probeConfigs.defaultIntensities
      );

      setDefaultIntensities(probeConfigs.defaultIntensities);
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
            {intensities &&
              intensities.map((intensity: number, i: number) => (
                <div className="mb-4 flex items-center group" key={`LED${i}`}>
                  <label
                    className="inline-block w-3/12 group-hover:text-accent"
                    htmlFor={`LED${i}`}
                  >
                    LED
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
          <span className="text-base">
            Status: <span id="LEDStatus"></span>
          </span>
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};

export default withLoading(Intensities, 'Contacting Hardware ...');
