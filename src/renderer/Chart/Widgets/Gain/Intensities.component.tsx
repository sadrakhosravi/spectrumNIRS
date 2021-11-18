import React, { useEffect } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { RecordChannels } from '@utils/channels';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Header from 'renderer/Chart/Widgets/Header/Header.component';

//Renders the filter widget on the sidebar
const Intensities = ({ setLoading, children }: any) => {
  const defaultValues = [180, 165, 140, 140, 140];
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );

  useEffect(() => {
    setLoading(false);
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
    <div className="bg-grey3 h-[calc(66.7%-3rem)] mt-5 rounded-md duration-300 border-[1.5px] border-[transparent] hover:drop-shadow-xl hover:border-[1.5px] hover:border-accent">
      <Header title="Intensities" />

      {/** Filter Form */}
      <div className="px-4 py-4">
        <h3>LED Intensities</h3>
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
        <h3>Pre Gain:</h3>
        <div className="grid grid-cols-3 gap-1">
          {sensorState.PreGain.map((preGainOption) => (
            <span>
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
        </div>
        <input
          className="my-2 h-40px px-4 w-1/2 mx-auto bg-grey1 rounded-sm"
          defaultValue="100"
          type="number"
          min="1"
          max="127"
        />
      </div>
      {children}
      <span className="p-4 text-base">
        Status: <span id="LEDStatus"></span>
      </span>
    </div>
  );
};

export default withLoading(Intensities, 'Contacting Hardware ...');
