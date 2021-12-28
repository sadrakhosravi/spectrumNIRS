import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import {
  setProbeCalibrationSidebar,
  setRecordSidebar,
  setReviewSidebar,
} from '@redux/AppStateSlice';

//Components
import Filter from './ProbeCalibrationWidgets/Filter.component';
import Intensities from './ProbeCalibrationWidgets/Intensities.component';
import IconButton from '@components/Buttons/IconButton.component';
import withTooltip from '@hoc/withTooltip.hoc';

// Icons
import HideRightPanelIcon from '@icons/hide-right-panel.svg';

// Constants
import { ChartType } from '@utils/constants';
import EventsWidget from './ReviewWidgets/Events.widget';

const IconButtonWithTooltip = withTooltip(IconButton, 'Hide sidebar', 'left');

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
    type === ChartType.PROBE_CALIBRATION &&
      dispatch(setProbeCalibrationSidebar(false));
  };

  return (
    <div className="h-[calc(100%+0px)] pl-2 py-4 ">
      {isSidebarActive && (
        <>
          {' '}
          <div className="h-[calc(100%-2rem)] relative pb-3 grid grid-flow-row grid-rows-5 gap-5">
            {type === ChartType.RECORD && (
              <>
                <Filter />
              </>
            )}
            {type === ChartType.REVIEW && (
              <>
                <EventsWidget />
              </>
            )}
            {type === ChartType.PROBE_CALIBRATION && (
              <div className="mt-2">
                <Intensities />
              </div>
            )}
          </div>
          <div className="absolute bottom-2 right-0 opacity-30 hover:opacity-100">
            <IconButtonWithTooltip
              icon={HideRightPanelIcon}
              onClick={handleHideSidebarClick}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WidgetsContainer;
