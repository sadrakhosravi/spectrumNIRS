import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

//Components
import Filter from './Filter/Filter.component';
import Intensities from './Gain/Intensities.component';
import { setRecordSidebar, setReviewSidebar } from '@redux/AppStateSlice';

// Constants
import { ChartType } from '@utils/constants';
import EventsWidget from './Events/Events.widget';

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
    <div className="h-[calc(100%-1px)]">
      {isSidebarActive && (
        <>
          {' '}
          <div className="h-[calc(100%-2rem)] relative pb-3 grid grid-flow-row grid-rows-5 gap-5">
            {type === ChartType.RECORD && (
              <>
                <Filter />
                <Intensities />
              </>
            )}
            {type === ChartType.REVIEW && (
              <>
                <EventsWidget />
              </>
            )}
          </div>
          <button
            className="absolute bottom-1 left-2 w-full h-8 text-light2 hover:text-white"
            onClick={handleHideSidebarClick}
          >
            Hide Sidebar
          </button>
        </>
      )}
    </div>
  );
};

export default WidgetsContainer;
