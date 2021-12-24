import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { RecordState } from '@utils/constants';

// Components
import Indicator from './Indicator.component';

const RecordingIndicator = () => {
  const recordState = useAppSelector((state) => state.recordState.value);

  // Check conditions
  const isActive =
    recordState === RecordState.RECORD || recordState === RecordState.CONTINUE;
  const isPaused = recordState === RecordState.PAUSED;

  return (
    <>
      {isActive && <Indicator text="Recording" color="green" />}
      {isPaused && <Indicator text="Paused" color="yellow" />}
    </>
  );
};
export default RecordingIndicator;
