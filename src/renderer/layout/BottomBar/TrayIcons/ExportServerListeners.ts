import { useEffect } from 'react';
import { ExportServerChannels, RecordChannels } from '@utils/channels';

const exportServerListeners = () => {
  useEffect(() => {
    // Handle start of device reader
    window.api.onIPCData(ExportServerChannels.StartStream, async () => {
      await window.api.invokeIPC(RecordChannels.Init);
      await window.api.invokeIPC(RecordChannels.Start);
    });

    // Handle stop of device reader
    window.api.onIPCData(ExportServerChannels.StopServer, async () => {
      await window.api.invokeIPC(RecordChannels.Stop);
    });

    // Handle stop of device reader
    window.api.onIPCData(ExportServerChannels.PauseStream, async () => {
      await window.api.invokeIPC(RecordChannels.Pause);
    });

    return () => {
      window.api.removeListeners(ExportServerChannels.StartStream);
      window.api.removeListeners(ExportServerChannels.StopServer);
      window.api.removeListeners(ExportServerChannels.PauseStream);
    };
  }, []);
};
export default exportServerListeners;
