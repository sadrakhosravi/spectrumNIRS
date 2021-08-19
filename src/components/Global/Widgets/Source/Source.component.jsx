import React from 'react';

//Components
import Header from '@globalComponent/Widgets/Header/Header.component';
import WidgetButton from '@globalComponent/Widgets/WidgetButton/WidgetButton.component';

//Renders the filter widget on the sidebar
const Source = () => {
  return (
    <div className="bg-grey3 h-1/4 relative mt-5">
      <Header title="Source" />

      {/** Filter Form */}
      <form className=" p-4">
        <select className="p-2 bg-grey1 w-full" name="filters" id="filters">
          <option value="" disabled selected>
            Select Source
          </option>
          <option value="lowpass">LowPass</option>
          <option value="highpass">HighPass</option>
        </select>

        <WidgetButton text="Apply" />
      </form>
    </div>
  );
};

export default Source;
