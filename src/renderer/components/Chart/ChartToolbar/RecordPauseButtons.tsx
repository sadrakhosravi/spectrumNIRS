import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRecordState } from '@redux/RecordStateSlice';

// Components
import IconButton from '@components/IconButton/IconButton.component';

// Icons
import RecordIcon from '@icons/record.svg';
import StopIcon from '@icons/stop.svg';
import PauseIcon from '@icons/pause.svg';

// Controller
import {
  newRecording,
  pauseRecording,
} from '@rendererController/recordController';

const RecordPauseButtons = () => {
  // Record button state
  const recordState = useSelector((state: any) => state.recordState.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (recordState !== 'idle') {
      dispatch(changeRecordState('idle'));
    }
    return () => {
      dispatch(changeRecordState('idle'));
    };
  }, []);

  // Change the record state on click.
  const recordBtnClickHandler = () => {
    newRecording();
  };

  // Change the record state on click.
  const pauseBtnClickHandler = () => {
    pauseRecording();
  };

  // Send record state state to ipcMain
  useEffect(() => {}, [recordState]);

  // Set button's styles based on the state value.
  switch (recordState) {
    default:
    case 'idle':
    case 'stop':
      return (
        <>
          <IconButton
            text="Record"
            icon={RecordIcon}
            darker
            onClick={recordBtnClickHandler}
            isActive={false}
          />
          <IconButton
            text="Pause"
            icon={PauseIcon}
            darker={false}
            isActive={false}
            disabled
            tooltip
            tooltipText="Start a recording first"
          />
        </>
      );

    case 'continue':
      return (
        <>
          <IconButton
            text="Stop"
            icon={StopIcon}
            darker
            onClick={recordBtnClickHandler}
            isActive
          />
          <IconButton
            text="Pause"
            icon={PauseIcon}
            darker
            onClick={pauseBtnClickHandler}
            isActive={false}
          />
        </>
      );
    case 'recording':
      return (
        <>
          <IconButton
            text="Stop"
            icon={StopIcon}
            darker
            onClick={recordBtnClickHandler}
            isActive
          />
          <IconButton
            text="Pause"
            icon={PauseIcon}
            darker
            onClick={pauseBtnClickHandler}
            isActive={false}
          />
        </>
      );

    case 'pause':
      return (
        <>
          <IconButton
            text="Stop"
            icon={StopIcon}
            darker
            onClick={recordBtnClickHandler}
            isActive
          />
          <IconButton
            text="Paused"
            icon={PauseIcon}
            darker
            onClick={pauseBtnClickHandler}
            isActive
          />
        </>
      );
  }
};

export default RecordPauseButtons;
