import * as React from 'react';

// Styles
import * as styles from './calibration.module.scss';

// Components
// import { ToolbarSection, ToolbarButton } from '/@/components/Toolbar';
import { Button } from '/@/components/Elements/Buttons/Button';

// Icons
// import { FiMinimize2 } from 'react-icons/fi';

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
        <Button text="Start" color="green" onClick={calibrationToolbarVM.handleDeviceStart} />
        <Button text="Stop" onClick={calibrationToolbarVM.handleDeviceStop} />
      </div>
    </>
  );
};
