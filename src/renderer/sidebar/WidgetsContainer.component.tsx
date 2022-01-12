import React from 'react';

//Components
import Filter from './ProbeCalibrationWidgets/Filter.component';
import Intensities from './ProbeCalibrationWidgets/Intensities.component';
import EventsWidget from './ReviewWidgets/Events.widget';
import ExportServerSettings from './ExportServer/ExportServerSettings.widget';
import ClientLog from './ExportServer/ClientLog.widget';

// Constants
import { SidebarType } from '@utils/constants';

//The container for each widget to be rendered in
const WidgetsContainer = ({
  type = SidebarType.RECORD,
}: {
  type?: SidebarType;
}) => {
  return (
    <div className="h-[calc(100%+0px)] px-4 py-4 ">
      <>
        {' '}
        <div className="h-[calc(100%-2rem)] relative pb-3 grid grid-flow-row grid-rows-5 gap-5">
          {type === SidebarType.RECORD && (
            <>
              <Filter />
            </>
          )}
          {type === SidebarType.REVIEW && (
            <>
              <EventsWidget />
            </>
          )}
          {type === SidebarType.PROBE_CALIBRATION && (
            <>
              <Intensities />
            </>
          )}
          {type === SidebarType.EXPORT_SERVER && (
            <>
              <ExportServerSettings />
              <ClientLog />
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default WidgetsContainer;
