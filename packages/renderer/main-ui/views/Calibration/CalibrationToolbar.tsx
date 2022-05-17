import * as React from 'react';

// Styles
import * as styles from './calibration.module.scss';

// Components
import { Button } from '/@/components/Elements/Buttons/Button';
import { DeviceList } from '../../components/Device';
import { ChartViewSwitcher } from '/@/components/Chart';

// Icons
// import { FiGrid } from 'react-icons/fi';

// View Models
import { CalibrationToolbarViewModel } from '@viewmodels/index';

// const iconSize = '18px';
// const iconStrokeColor = '#ccc';
// const iconStrokeWidth = 2;

const calibrationToolbarVM = new CalibrationToolbarViewModel();

export const CalibrationToolbar = () => {
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
          <DeviceList />
        </span>

        <Button text="Start" onClick={calibrationToolbarVM.handleDeviceStart} />
        <Button text="Stop" onClick={calibrationToolbarVM.handleDeviceStop} />
      </div>
    </>
  );
};
