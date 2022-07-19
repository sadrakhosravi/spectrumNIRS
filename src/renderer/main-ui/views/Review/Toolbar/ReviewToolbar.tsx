import * as React from 'react';
import { ipcRenderer } from 'electron';
import { DialogBoxChannels } from '@utils/channels';

// Styles
import styles from './reviewToolbar.module.scss';

// Components
import { Button } from '/@/components/Elements/Buttons/Button';

// Icons
// import { FiGrid } from 'react-icons/fi';

// View Models
import { observer } from 'mobx-react-lite';

// Models
import { BeastDataExporter } from '@models/Device/Modules/Beast/BeastDataExporter';
import { recordingVM } from '/@/viewmodels/VMStore';
import { DataModelType } from '/@/models/Recording/RecordingDataModel';

// const iconSize = '18px';
// const iconStrokeColor = '#ccc';
// const iconStrokeWidth = 2;

export const ReviewToolbar = observer(() => {
  const handleDataExport = async () => {
    const savePath = await ipcRenderer.invoke(DialogBoxChannels.GetSaveDialog);
    const beastExporter = new BeastDataExporter(
      savePath,
      recordingVM.currentRecording?.id as number,
      recordingVM.currentRecording?.data as DataModelType
    );

    beastExporter.exportData();
  };

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
        <Button text="Export Data As CSV" onClick={handleDataExport} />
      </div>
    </>
  );
});
