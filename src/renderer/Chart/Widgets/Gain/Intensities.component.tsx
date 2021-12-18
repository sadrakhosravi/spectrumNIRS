import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { RecordChannels, UserSettingsChannels } from '@utils/channels';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '../Widget.component';
import { setSensorIntensities } from '@redux/SensorStateSlice';

//Renders the filter widget on the sidebar
const Intensities = ({ setLoading }: any) => {
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const dispatch = useAppDispatch();
  let intensities = sensorState.intensities;

  useEffect(() => {
    (async () => {
      const test = await window.api.invokeIPC(
        UserSettingsChannels.GetSetting,
        '1'
      );
      await window.api.invokeIPC(UserSettingsChannels.AddSetting, {
        key: 'LEDIntensities',
        value: intensities,
      });
      console.log(test);
      setLoading(false);
    })();
  }, []);

  const handleRangeSliderChange = (event: any) => {
    const id = event.target.id;
    const element = document.getElementById(`${id}Value`) as HTMLElement;
    element.innerText = event.target.value;
  };

  const handleRangeMouseUp = async () => {
    const newIntensities: any[] = [];
    sensorState.LEDs.forEach((LED) => {
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

  return (
    <Widget span="3">
      <Tabs>
        <Tabs.Tab label="Intensities">
          <div>
            {sensorState.LEDs.map((LED, index) => (
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
                  defaultValue={intensities[index]}
                  onMouseUp={handleRangeMouseUp}
                  onChange={handleRangeSliderChange}
                />
                <span
                  id={`${LED}Value`}
                  className="absolute right-0 -bottom-4 text-base"
                >
                  {intensities[index]}
                </span>
              </div>
            ))}
          </div>
          <span className="p-4 text-base">
            Status: <span id="LEDStatus"></span>
          </span>
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};

export default withLoading(Intensities, 'Contacting Hardware ...');
