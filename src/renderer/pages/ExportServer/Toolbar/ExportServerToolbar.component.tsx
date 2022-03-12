import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import ToolbarContainer from '@components/Toolbar/ToolbarContainer.component';
import Button from '@components/Buttons/Button.component';

// Icons
import StartIcon from '@icons/start.svg';
import StopIcon from '@icons/stop.svg';
import PauseIcon from '@icons/pause.svg';

// Channels

const ExportServerToolbar = () => {
  const isStreaming = useAppSelector(
    (state) => state.global.exportServer?.serverStatus?.isStreamingData
  );
  const status = useAppSelector(
    (state) => state.global.exportServer?.serverStatus
  );

  return (
    <ToolbarContainer>
      <div className="grid h-full w-full grid-cols-6 items-center px-6">
        <div className="text-lg">Export Server</div>
        <div className="col-span-2 col-start-5 flex items-center justify-end gap-2">
          {status && (
            <>
              {/** Pause Button - only show if the export server is streaming */}
              <Button
                disabled={true}
                text={'Pause'}
                className="bg-accent"
                icon={PauseIcon}
                isActive={isStreaming === 'paused'}
                onClick={undefined}
                title={isStreaming ? undefined : 'Start streaming first'}
              />
              <Button
                disabled={true}
                text={isStreaming ? 'Stop Streaming' : 'Start Streaming'}
                className="bg-accent"
                icon={isStreaming ? StopIcon : StartIcon}
                isActive={isStreaming !== null}
                onClick={undefined}
              />
            </>
          )}
        </div>
      </div>
    </ToolbarContainer>
  );
};
export default ExportServerToolbar;
