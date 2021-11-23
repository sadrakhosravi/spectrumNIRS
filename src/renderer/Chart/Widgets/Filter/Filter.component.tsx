import React from 'react';

//Components
import Header from 'renderer/Chart/Widgets/Header/Header.component';
import WidgetButton from 'renderer/Chart/Widgets/WidgetButton/WidgetButton.component';

//Renders the filter widget on the sidebar
const Filter = () => {
  return (
    <div className="bg-grey3 h-1/3 relative rounded-md">
      <Header />

      {/** Filter Form */}
      <form className=" p-4">
        <select className="p-2 bg-grey1 w-full" name="filters" id="filters">
          <option value="" disabled selected>
            Select filter
          </option>
          <option value="lowpass">LowPass</option>
          <option value="highpass">HighPass</option>
        </select>

        <select
          className="p-2 bg-grey1 w-full mt-3"
          name="filter-type"
          id="filter-type"
        >
          <option value="lowpass">Filter value</option>
        </select>

        <WidgetButton text="Apply Filter" />
      </form>
    </div>
  );
};

export default Filter;
