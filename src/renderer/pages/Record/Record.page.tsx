import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

// Main area components
import RecordChart from 'renderer/Chart/RecordChart.component';

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';

// Constants
import { ChartType } from 'utils/constants';
import { setRecordSidebar } from '@redux/AppStateSlice';

const RecordPage = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const recordState = useAppSelector(
    (state) => state.experimentData.currentRecording
  );
  const location = useLocation();
  const isSidebarActive = useAppSelector(
    (state) => state.appState.recordSidebar
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      setIsHidden(true);
      setFirstLoad(false);
    }, 200);
  }, []);

  useEffect(() => {
    location.pathname === '/main/recording/record' && setIsHidden(false);
    location.pathname !== '/main/recording/record' &&
      !firstLoad &&
      setIsHidden(true);
  }, [location]);

  return (
    <div className="h-full" hidden={isHidden}>
      <div className={`absolute top-0 left-0 h-full w-full flex`}>
        <div
          className={`h-full relative ${
            isSidebarActive
              ? 'w-[calc(100%-350px)] mr-[15px]'
              : 'w-[calc(100%-20px)]'
          }`}
        >
          <RecordChart recordState={recordState} type={ChartType.RECORD} />
        </div>
        <div
          className={`h-full ${
            isSidebarActive
              ? 'w-[325px]'
              : 'w-[20px] bg-grey1 hover:bg-accent hover:cursor-pointer'
          }`}
          onClick={() => !isSidebarActive && dispatch(setRecordSidebar(true))}
        >
          {!isHidden && <WidgetsContainer type={ChartType.RECORD} />}
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
