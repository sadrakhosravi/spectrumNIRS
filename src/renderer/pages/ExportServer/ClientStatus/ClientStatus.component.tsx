import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

import Tabs from '@components/Tabs/Tabs.component';
import Container from '@components/Containers/Container.component';
import ListButton from '@components/Buttons/ListButton';

import WebSocketIcon from '@icons/websocket.svg';
import { DialogBoxChannels, ExportServerChannels } from '@utils/channels';
import GlobalStore from '@lib/globalStore/GlobalStore';
import { IClientStatus } from '@electron/models/ExportServer/ExportServer';
import DisabledOverlay from '@components/Overlay/DisabledOverlay.component';

const ClientStatus = () => {
  const clientStatus = useAppSelector(
    (state) => state.global.exportServer?.clientStatus
  );

  const sendTo = useAppSelector((state) => state.global.exportServer?.sendTo);
  const isStreamingData = useAppSelector(
    (state) => state.global.exportServer?.serverStatus?.isStreamingData
  );

  // Formats the name string
  const formatName = (name: string) => {
    if (!name) return null;
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    return formattedName;
  };

  const handleDeleteBtnClick = async (clientName: string) => {
    const confirmation = await window.api.invokeIPC(
      DialogBoxChannels.MessageBoxSync,
      {
        title: 'Confirm selection',
        type: 'warning',
        message: 'Are you sure you want to remove this client?',
        detail:
          'This will stop the data stream and the client will be disconnected.',
        buttons: ['Yes', 'Cancel'],
        noLink: true,
        defaultId: 1,
        cancelId: 1,
      }
    );

    // The user has cancelled the operation
    if (confirmation === 1) return;

    // Ask controller to delete the client.
    await window.api.invokeIPC(ExportServerChannels.RemoveClient, clientName);
  };

  const handleClientSocketClick = (status: IClientStatus) =>
    status.status === 'Open' &&
    GlobalStore.setExportServer('sendTo', status.appName);

  return (
    <Container noPadding>
      <Tabs noBorder>
        <Tabs.Tab label="Clients">
          <> {isStreamingData && <DisabledOverlay />}</>

          <div className="py-2">
            {clientStatus?.map((status) => (
              <ListButton
                key={status.name + 'export-client-status'}
                isActive={false}
                onClick={() => handleClientSocketClick(status)}
                icon={WebSocketIcon}
                className={
                  sendTo === status.appName
                    ? 'ring-2 ring-accent'
                    : sendTo === 'All Clients'
                    ? status.status === 'Open'
                      ? 'ring-2 ring-accent'
                      : 'opacity-70'
                    : 'opacity-70' + ' focus:ring-0 active:ring-0'
                }
                text={formatName(status?.appName as string) || 'Client'}
                description={
                  <ul className="ml-4 list-disc text-sm">
                    <li>
                      Connection:{' '}
                      {status.state === 1 ? 'Open' : 'Not connected'}{' '}
                    </li>
                    <li>Status: {status.status}</li>
                    <li>IP: {status.ip?.split('f:')[1]}</li>
                  </ul>
                }
                deleteOnClick={() => handleDeleteBtnClick(status.name)}
              />
            ))}
            {!clientStatus ||
              (clientStatus.length === 0 && (
                <p className="text-white/40">Waiting for connection ...</p>
              ))}
          </div>
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
};
export default ClientStatus;
