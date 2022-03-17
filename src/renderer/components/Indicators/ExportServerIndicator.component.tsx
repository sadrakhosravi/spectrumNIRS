import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import Indicator from './Indicator.component';

const ExportServerIndicator = () => {
  const isServerActive = useAppSelector(
    (state) => state.global.exportServer?.serverStatus?.status
  );
  const isStreaming = useAppSelector(
    (state) => state.global.exportServer?.serverStatus?.isStreamingData
  );

  return (
    <>
      {isServerActive && (
        <Indicator
          text={`Export: ${isStreaming === null ? 'Ready' : isStreaming}`}
          color="cyan"
          title="Export server is active and ready"
        />
      )}
    </>
  );
};
export default ExportServerIndicator;
