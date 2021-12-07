import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { RecordChannels, UserSettingsChannels } from '@utils/channels';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Header from 'renderer/Chart/Widgets/Header/Header.component';
import TabButton from '../Tabs/TabButton.component';

//Renders the filter widget on the sidebar
const Intensities = ({ setLoading, children }: any) => {
  const [currentTab, setCurrentTab] = useState(0);
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  let defaultValues = sensorState.defaultIntensities;

  useEffect(() => {
    (async () => {
      const test = await window.api.invokeIPC(
        UserSettingsChannels.GetSetting,
        '1'
      );
      await window.api.invokeIPC(UserSettingsChannels.AddSetting, {
        key: 'LEDIntensities',
        value: defaultValues,
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
    const intensities: any[] = [];
    sensorState.LEDs.forEach((LED) => {
      const currentLED = document.getElementById(LED) as HTMLInputElement;
      intensities.push(currentLED.value);
    });
    intensities.push('HIGH');
    intensities.push('100');
    const result = await window.api.invokeIPC(
      RecordChannels.SyncGain,
      intensities
    );
    console.log(result);
    if (result) {
      (document.getElementById('LEDStatus') as HTMLSpanElement).innerText =
        'Successful';
    } else {
      (document.getElementById('LEDStatus') as HTMLSpanElement).innerText =
        'Failed';
    }
    console.log(intensities.join(','));
  };

  return (
    <div className="bg-grey3 h-[calc(66.7%-3rem)] mt-5 rounded-b-md">
      <Header>
        <TabButton
          text="Intensities"
          isActive={currentTab === 0}
          onClick={() => setCurrentTab(0)}
        />
        <TabButton
          text="Gain"
          isActive={currentTab === 1}
          onClick={() => setCurrentTab(1)}
        />
      </Header>

      {/** Filter Form */}

      <div className="px-4 py-4">
        <div hidden={currentTab !== 0}>
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
                defaultValue={defaultValues[index]}
                onMouseUp={handleRangeMouseUp}
                onChange={handleRangeSliderChange}
              />
              <span
                id={`${LED}Value`}
                className="absolute right-0 -bottom-4 text-base"
              >
                {defaultValues[index]}
              </span>
            </div>
          ))}
        </div>

        <div className="" hidden={currentTab !== 1}>
          {sensorState.PreGain.map((preGainOption) => (
            <span key={preGainOption}>
              <input
                type="radio"
                id={`${preGainOption}Gain`}
                name="pregain"
                value={preGainOption}
                checked={preGainOption === 'HIGH'}
              />
              <label className="text-base" htmlFor={`${preGainOption}Gain`}>
                {preGainOption}
              </label>
            </span>
          ))}

          <input
            className="my-2 h-40px px-4 w-1/2 mx-auto bg-grey1 rounded-sm"
            defaultValue="100"
            type="number"
            min="1"
            max="127"
          />
        </div>
      </div>

      {children}
      <span className="p-4 text-base">
        Status: <span id="LEDStatus"></span>
      </span>
    </div>
  );
};

export default withLoading(Intensities, 'Contacting Hardware ...');
