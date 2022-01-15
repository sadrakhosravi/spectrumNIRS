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
import { ExportServerChannels } from '@utils/channels';
import toast from 'react-hot-toast';

const ExportServerToolbar = () => {
  const isStreaming = useAppSelector(
    (state) => state.global.exportServer?.serverStatus?.isStreamingData
  );
  const status = useAppSelector(
    (state) => state.global.exportServer?.serverStatus?.status
  );

  const clients = useAppSelector(
    (state) => state.global.exportServer?.clientStatus
  );

  const handleStartStreamBtnClick = async () => {
    if (clients?.length === 0) {
      toast.error('No clients connected! Cannot start the stream.');
      return;
    }
    await window.api.invokeIPC(
      isStreaming !== null
        ? ExportServerChannels.StopStream
        : ExportServerChannels.StartStream
    );
  };

  const handlePauseBtnClick = async () => {
    await window.api.invokeIPC(
      isStreaming !== 'paused'
        ? ExportServerChannels.PauseStream
        : ExportServerChannels.StartStream
    );
  };

  return (
    <ToolbarContainer>
      <div className="grid grid-cols-6 items-center w-full h-full px-6">
        <div className="text-lg">Export Server</div>
        <div className="col-start-5 col-span-2 flex justify-end items-center gap-2">
          {status && (
            <>
              {/** Pause Button - only show if the export server is streaming */}
              <Button
                text={'Pause'}
                className="bg-accent"
                icon={PauseIcon}
                isActive={isStreaming === 'paused'}
                disabled={!isStreaming}
                onClick={handlePauseBtnClick}
                title={isStreaming ? undefined : 'Start streaming first'}
              />
              <Button
                text={isStreaming ? 'Stop Streaming' : 'Start Streaming'}
                className="bg-accent"
                icon={isStreaming ? StopIcon : StartIcon}
                isActive={isStreaming !== null}
                onClick={handleStartStreamBtnClick}
              />
            </>
          )}
        </div>
      </div>
    </ToolbarContainer>
  );
};
export default ExportServerToolbar;
