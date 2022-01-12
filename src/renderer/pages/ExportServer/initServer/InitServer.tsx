import { useEffect } from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { ExportServerChannels } from '@utils/channels';
import {
  resetExportServerInfo,
  setClientStatus,
  setError,
  setExportServerInfo,
  setExportServerStatus,
} from '@redux/ExportServerSlice';

const InitExportServer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      // Start the server
      await window.api.invokeIPC(ExportServerChannels.StartServer);

      // Register event listeners
      window.api.onIPCData(ExportServerChannels.ServerInfo, (_, data) => {
        console.log(data);
        dispatch(setExportServerInfo(data));
      });
      window.api.onIPCData(ExportServerChannels.ServerError, (_, data) => {
        console.log('Error' + data);
        dispatch(setError(data));
      });

      window.api.onIPCData(
        ExportServerChannels.ServerStatus,
        (_, { serverStatus, clientStatus }) => {
          dispatch(setExportServerStatus(serverStatus));
          dispatch(setClientStatus(clientStatus));
        }
      );
      window.api.onIPCData(ExportServerChannels.Restarted, () => {
        console.log('RESTARTED');
        dispatch(resetExportServerInfo());
      });
    })();

    return () => {
      window.api.sendIPC(ExportServerChannels.StopServer);
      window.api.removeListeners(ExportServerChannels.ServerInfo);
      window.api.removeListeners(ExportServerChannels.ServerStatus);
      window.api.removeListeners(ExportServerChannels.ServerError);
      window.api.removeListeners(ExportServerChannels.Restarted);
      dispatch(resetExportServerInfo());
    };
  }, []);
};
export default InitExportServer;
