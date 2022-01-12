import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import Indicator from './Indicator.component';

const ExportServerIndicator = () => {
  const isServerActive = useAppSelector(
    (state) => state.exportServerState.serverInfo.ip
  );

  return (
    <>
      {isServerActive && (
        <Indicator
          text="Export Server"
          color="cyan"
          title="Export server is active and ready"
        />
      )}
    </>
  );
};
export default ExportServerIndicator;
