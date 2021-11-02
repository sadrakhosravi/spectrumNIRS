import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

//Components
import Filter from './Filter/Filter.component';
import Gain from './Gain/Gain.component';
import Source from './Source/Source.component';
import { setRecordSidebar } from '@redux/AppStateSlice';

//The container for each widget to be rendered in
const WidgetsContainer = () => {
  const isSidebarActive = useAppSelector(
    (state) => state.appState.recordSidebar
  );
  const dispatch = useAppDispatch();

  return (
    <>
      {isSidebarActive && (
        <>
          <Filter />
          <Gain />
          <Source />
          <button
            className="absolute bottom-1 left-2 w-full h-8 text-light2 hover:text-white"
            onClick={() => dispatch(setRecordSidebar(false))}
          >
            Hide Sidebar
          </button>
        </>
      )}
    </>
  );
};

export default WidgetsContainer;
