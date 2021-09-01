import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRecordState } from '@redux/RecordStateSlice';

//Components
import IconButton from '@globalComponent/IconButton/IconButton.component';

//Icons
import RecordIcon from '@icons/record.svg';
import StopIcon from '@icons/stop.svg';
import PauseIcon from '@icons/pause.svg';

//Electron
const { ipcRenderer } = window.require('electron');

const RecordPauseButtons = () => {
  //Record button state
  const recordState = useSelector(state => state.recordState.value);
  const dispatch = useDispatch();

  //Change the record state on click.
  const recordBtnClickHandler = async () => {
    recordState === 'recording' || recordState === 'pause'
      ? dispatch(changeRecordState('idle'))
      : dispatch(changeRecordState('recording'));
  };

  //Change the record state on click.
  const pauseBtnClickHandler = () => {
    recordState === 'pause' ? dispatch(changeRecordState('recording')) : dispatch(changeRecordState('pause'));
  };

  //Send record state state to ipcMain
  useEffect(() => {
    ipcRenderer.send(`record:${recordState}`);
  }, [recordState]);

  //Set button's styles based on the state value.
  switch (recordState) {
    case 'idle':
      return (
        <>
          <IconButton
            text="Record"
            icon={RecordIcon}
            darker={true}
            onClick={recordBtnClickHandler}
            isActive={false}
          />
          <IconButton
            text="Pause"
            icon={PauseIcon}
            darker={false}
            isActive={false}
            disabled={true}
            tooltip={true}
            tooltipText="Start a recording first"
          />
        </>
      );

    case 'recording':
      return (
        <>
          <IconButton
            text="Stop"
            icon={StopIcon}
            darker={true}
            onClick={recordBtnClickHandler}
            isActive={true}
          />
          <IconButton
            text="Pause"
            icon={PauseIcon}
            darker={true}
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
            icon={RecordIcon}
            darker={true}
            onClick={recordBtnClickHandler}
            isActive={true}
          />
          <IconButton
            text="Paused"
            icon={PauseIcon}
            darker={true}
            onClick={pauseBtnClickHandler}
            isActive={true}
          />
        </>
      );

    default:
      return;
  }
};

export default RecordPauseButtons;
