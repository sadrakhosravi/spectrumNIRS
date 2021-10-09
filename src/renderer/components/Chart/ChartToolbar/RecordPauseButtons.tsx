import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRecordState } from '@redux/RecordStateSlice';

// Components
import IconTextButton from '@components/Buttons/IconTextButton.component';

// Icons
import RecordIcon from '@icons/record.svg';
import StopIcon from '@icons/stop.svg';
import PauseIcon from '@icons/pause.svg';

// HOC
import withTooltip from 'renderer/hoc/withTooltip.hoc';
const PauseButton = withTooltip(IconTextButton, 'Start a recording first');

// Adapter
import { newRecording, pauseRecording } from '@adapters/recordAdapter';

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
          <IconTextButton
            text="Record"
            icon={RecordIcon}
            darker
            onClick={recordBtnClickHandler}
            isActive={false}
          />
          <PauseButton
            text="Pause"
            icon={PauseIcon}
            darker={false}
            isActive={false}
            disabled
          />
        </>
      );

    case 'continue':
      return (
        <>
          <IconTextButton
            text="Stop"
            icon={StopIcon}
            darker
            onClick={recordBtnClickHandler}
            isActive
          />
          <IconTextButton
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
          <IconTextButton
            text="Stop"
            icon={StopIcon}
            darker
            onClick={recordBtnClickHandler}
            isActive
          />
          <IconTextButton
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
          <IconTextButton
            text="Stop"
            icon={StopIcon}
            darker
            onClick={recordBtnClickHandler}
            isActive
          />
          <IconTextButton
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
