import React, { useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import Container from '@components/Containers/Container.component';

// Icons
import Tabs from '@components/Tabs/Tabs.component';
import Button from '@components/Buttons/Button.component';
import { ExportServerChannels } from '@utils/channels';

const ServerStatus = () => {
  const [restartBtnText, setRestartBtnText] = useState('Restart Server');

  const serverStatus = useAppSelector(
    (state) => state.exportServerState.serverStatus
  );

  // Handles the restart server button click
  const handleRestartServerBtnClick = async () => {
    const isRestarted = await window.api.invokeIPC(
      ExportServerChannels.RestartServer
    );
    if (isRestarted) {
      setRestartBtnText('Restart successful!');
      setTimeout(() => {
        setRestartBtnText('Restart Server');
      }, 2000);
    } else {
      setRestartBtnText('Restart failed!');
    }
  };

  console.log(serverStatus);

  return (
    <Container noPadding>
      <Tabs noBorder>
        <Tabs.Tab label="Server Status">
          <>
            {/* {!serverStatus && (
              <div className="w-full h-full flex items-center justify-center bg-rose-600">
                Error has occurred. Please restart the application and try
                again.
              </div>
            )} */}
            <div className="py-2">
              <div className="flex flex-wrap mb-4">
                <span className="w-2/4 bg-grey2 px-2 h-full py-2">Status:</span>
                <span className="w-2/4 py-2 px-2 bg-grey1 border-b-primary">
                  {serverStatus?.status || 'Server is not connected'}
                </span>
                <span className="w-2/4 bg-grey2 px-2 h-full py-2">
                  Conncted Devices:
                </span>
                <span className="w-2/4 py-2 px-2 bg-grey1 border-b-primary">
                  {serverStatus?.clients}
                </span>
                <span className="w-2/4 bg-grey2 px-2 h-full py-2">
                  Available Protocols:
                </span>
                <span className="w-2/4 py-2 px-2 bg-grey1">
                  {serverStatus?.protocols && serverStatus.protocols.join(', ')}
                </span>
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button
                text={restartBtnText}
                onClick={handleRestartServerBtnClick}
              />
            </div>
          </>
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
};
export default ServerStatus;
