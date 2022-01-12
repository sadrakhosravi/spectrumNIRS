import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

import Tabs from '@components/Tabs/Tabs.component';
import Container from '@components/Containers/Container.component';
import ListButton from '@components/Buttons/ListButton';

import WebSocketIcon from '@icons/websocket.svg';
import { DialogBoxChannels, ExportServerChannels } from '@utils/channels';

const ClientStatus = () => {
  const clientStatus = useAppSelector(
    (state) => state.exportServerState.clientStatus
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

  console.log(clientStatus);

  return (
    <Container noPadding>
      <Tabs noBorder>
        <Tabs.Tab label="Clients">
          <div className="py-2">
            {clientStatus?.map((status) => (
              <ListButton
                isActive={false}
                onClick={undefined}
                icon={WebSocketIcon}
                text={formatName(status?.name) || 'Client'}
                description={`${
                  status.state === 1 ? 'Open' : 'Not connected'
                } - Client IP: ${status.ip?.split('f:')[1]}`}
                deleteOnClick={() => handleDeleteBtnClick(status.name)}
              />
            ))}
            {!clientStatus ||
              (clientStatus.length === 0 && (
                <p className="text-white/40">No clients found.</p>
              ))}
          </div>
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
};
export default ClientStatus;
