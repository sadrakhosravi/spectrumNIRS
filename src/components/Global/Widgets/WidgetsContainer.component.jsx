import React from 'react';

//Components
import Filter from '@globalComponent/Widgets/Filter/Filter.component';
import Gain from '@globalComponent/Widgets/Gain/Gain.component';
import Source from '@globalComponent/Widgets/Source/Source.component';

//The container for each widget to be rendered in
const WidgetsContainer = props => {
  return (
    <>
      <Filter />
      <Gain />
      <Source />
    </>
  );
};

export default WidgetsContainer;
