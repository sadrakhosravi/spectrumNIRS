import React from 'react';

//Components
import Header from '@globalComponent/Widgets/Header/Header.component';
import WidgetButton from '@globalComponent/Widgets/WidgetButton/WidgetButton.component';

//Renders the filter widget on the sidebar
const Gain = () => {
  return (
    <div className="bg-grey3 h-1/3 relative mt-5">
      <Header title="Gain" />

      {/** Filter Form */}
      <form className=" p-4">
        <select className="p-2 bg-grey1 w-full" name="filters" id="filters">
          <option value="" disabled selected>
            Select Gain
          </option>
          <option value="lowpass">LowPass</option>
          <option value="highpass">HighPass</option>
        </select>

        <select
          className="p-2 bg-grey1 w-full mt-3"
          name="filter-type"
          id="filter-type"
        >
          <option value="lowpass">Gain value</option>
        </select>

        <WidgetButton text="Apply Gain" />
      </form>
    </div>
  );
};

export default Gain;
