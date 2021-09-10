import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRecordState } from '@redux/RecordStateSlice';

// Components
import IconButton from '@globalComponent/IconButton/IconButton.component';

// Icons
import RecordIcon from '@icons/record.svg';
import StopIcon from '@icons/stop.svg';
import PauseIcon from '@icons/pause.svg';

// Electron
const { ipcRenderer } = window.require('electron');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change the record state on click.
  const recordBtnClickHandler = () => {
    if (recordState !== 'idle' && recordState !== 'stop') {
      dispatch(changeRecordState('stop'));
    } else {
      dispatch(changeRecordState('recording'));
    }
  };

  // Change the record state on click.
  const pauseBtnClickHandler = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    recordState === 'pause'
      ? dispatch(changeRecordState('continue'))
      : dispatch(changeRecordState('pause'));
  };

  // Send record state state to ipcMain
  useEffect(() => {
    // Send ipc message if record state is not idle.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    recordState !== 'idle' && ipcRenderer.send(`record:${recordState}`);
  }, [recordState]);

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
