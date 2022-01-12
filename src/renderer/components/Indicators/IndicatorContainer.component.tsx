import React from 'react';
import ExportServerIndicator from './ExportServerIndicator.component';
import RecordingIndicator from './RecordingIndicator.component';

type IndicatorContainerProps = {};

const IndicatorContainer = ({}: IndicatorContainerProps) => {
  return (
    <div
      className={`absolute flex items-center px-3 h-[30px] top-[0px] right-[200px] w-[300px] gap-2 z-50 `}
    >
      <RecordingIndicator />
      <ExportServerIndicator />
    </div>
  );
};
export default IndicatorContainer;
