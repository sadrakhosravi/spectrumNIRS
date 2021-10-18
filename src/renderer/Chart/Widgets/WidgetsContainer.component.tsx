import React from 'react';

//Components
import Filter from './Filter/Filter.component';
import Gain from './Gain/Gain.component';
import Source from './Source/Source.component';

//The container for each widget to be rendered in
const WidgetsContainer = () => {
  return (
    <>
      <Filter />
      <Gain />
      <Source />
    </>
  );
};

export default WidgetsContainer;
