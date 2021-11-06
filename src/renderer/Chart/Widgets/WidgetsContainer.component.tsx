import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

//Components
import Filter from './Filter/Filter.component';
import Gain from './Gain/Gain.component';
import Source from './Source/Source.component';
import { setRecordSidebar, setReviewSidebar } from '@redux/AppStateSlice';

// Constants
import { ChartType } from '@utils/constants';

//The container for each widget to be rendered in
const WidgetsContainer = ({
  type = ChartType.RECORD,
}: {
  type?: ChartType;
}) => {
  const isSidebarActive = useAppSelector(
    (state) => state.appState[`${type}Sidebar`]
  );
  const dispatch = useAppDispatch();

  // Hides the sidebar based on its type
  const handleHideSidebarClick = () => {
    type === ChartType.RECORD && dispatch(setRecordSidebar(false));
    type === ChartType.REVIEW && dispatch(setReviewSidebar(false));
  };

  return (
    <>
      {isSidebarActive && (
        <div className="h-full relative pb-3">
          <Filter />
          <Gain />
          <Source />
          <button
            className="absolute bottom-1 left-2 w-full h-8 text-light2 hover:text-white"
            onClick={handleHideSidebarClick}
          >
            Hide Sidebar
          </button>
        </div>
      )}
    </>
  );
};

export default WidgetsContainer;
