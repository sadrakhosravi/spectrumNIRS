import * as React from 'react';

// Components
import { Toolbar, ToolbarSection, ToolbarButton } from '/@/components/Toolbar';

// Icons
import { FiMinimize2 } from 'react-icons/fi';

const iconSize = '18px';
const iconStrokeColor = '#ccc';
const iconStrokeWidth = 2;

export const CalibrationToolbar = () => {
  return (
    <Toolbar>
      <ToolbarSection text="Charts">
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
      </ToolbarSection>
    </Toolbar>
  );
};
