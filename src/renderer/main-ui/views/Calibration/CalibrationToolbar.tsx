import * as React from 'react';

// Styles
import styles from './calibration.module.scss';

// Components
import { Button } from '/@/components/Elements/Buttons/Button';
import { ActiveDeviceList } from '../../components/Device';
import { ChartViewSwitcher } from '/@/components/Chart';

// Icons
// import { FiGrid } from 'react-icons/fi';

// View Models
import { CalibrationToolbarViewModel } from '@viewmodels/index';
import { recordingVM } from '@store';
import { observer } from 'mobx-react-lite';

// const iconSize = '18px';
// const iconStrokeColor = '#ccc';
// const iconStrokeWidth = 2;

const calibrationToolbarVM = new CalibrationToolbarViewModel();

export const CalibrationToolbar = observer(() => {
  return (
    <>
      {/* <ToolbarSection text="Charts">
        <ToolbarButton
          icon={
            <FiMinimize2 size={iconSize} strokeWidth={iconStrokeWidth} color={iconStrokeColor} />
          }
          tooltipText={'Channel Height'}
        />
        <ToolbarButton
          icon={
            <FiMinimize2 size={iconSize} strokeWidth={iconStrokeWidth} color={iconStrokeColor} />
          }
          tooltipText={'Channel Height'}
        />
        <ToolbarButton
          icon={
            <FiMinimize2 size={iconSize} strokeWidth={iconStrokeWidth} color={iconStrokeColor} />
          }
          tooltipText={'Channel Height'}
        />
      </ToolbarSection>
      <ToolbarSection text="File">
        <ToolbarButton
          icon={
            <FiMinimize2 size={iconSize} strokeWidth={iconStrokeWidth} color={iconStrokeColor} />
          }
          tooltipText={'Channel Height'}
        />
        <ToolbarButton
          icon={
            <FiMinimize2 size={iconSize} strokeWidth={iconStrokeWidth} color={iconStrokeColor} />
          }
          tooltipText={'Channel Height'}
        />
        <ToolbarButton
          icon={
            <FiMinimize2 size={iconSize} strokeWidth={iconStrokeWidth} color={iconStrokeColor} />
          }
          tooltipText={'Channel Height'}
        />
      </ToolbarSection> */}
      <div className={styles.ActionButtonContainer}>
        <ChartViewSwitcher />
        <span className={styles.DeviceListButtonContainer}>
          <ActiveDeviceList />
        </span>

        <Button
          text="Start"
          disabled={
            recordingVM.currentRecording?.deviceManager.isRecordingData ||
            recordingVM.currentRecording?.hasData ||
            !recordingVM.currentRecording?.deviceManager.devices[0]?.isConnected
          }
          className={styles.GreenButton}
          onClick={calibrationToolbarVM.handleDeviceStart}
        />
        <Button
          text="Stop"
          disabled={
            !recordingVM.currentRecording?.deviceManager.isRecordingData
          }
          className={styles.RedButton}
          onClick={calibrationToolbarVM.handleDeviceStop}
        />
      </div>
    </>
  );
});
