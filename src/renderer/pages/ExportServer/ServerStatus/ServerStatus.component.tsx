import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import Container from '@components/Containers/Container.component';
import Tabs from '@components/Tabs/Tabs.component';
import Button from '@components/Buttons/Button.component';

// Icons
import ExportServerIcon from '@icons/export-server.svg';
import RestartIcon from '@icons/restart.svg';

// Channels
import { ExportServerChannels } from '@utils/channels';

const ServerStatus = () => {
  const [restartBtnText, setRestartBtnText] = useState('Restart Server');
  const [statusText, setStatusText] = useState('Start Server');

  const serverStatus = useAppSelector(
    (state) => state.global.exportServer?.serverStatus
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
      }, 1500);
    } else {
      setRestartBtnText('Restart failed!');
    }
  };

  // Handles the stop/start server button
  const handleStopStartBtn = async () => {
    await window.api.invokeIPC(
      serverStatus
        ? ExportServerChannels.StopServer
        : ExportServerChannels.StartServer
    );
  };

  console.log(serverStatus?.protocols);

  // Check server status and set the status text state
  useEffect(() => {
    serverStatus ? setStatusText('Stop Server') : setStatusText('Start Server');
  }, [serverStatus]);

  return (
    <Container noPadding>
      <Tabs noBorder>
        <Tabs.Tab label="Server Status">
          <>
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
                <span className="w-2/4 bg-grey2 px-2 h-full py-2 border-b-primary">
                  Available Protocols:
                </span>
                <span className="w-2/4 py-2 px-2 bg-grey1 border-b-primary">
                  {serverStatus?.protocols?.map((protocol, i) =>
                    i === 0 ? protocol.name : ', ' + protocol.name
                  )}
                </span>
                <span className="w-2/4 bg-grey2 px-2 h-full py-2">
                  Selected Protocol:
                </span>
                <span className="w-2/4 py-2 px-2 bg-grey1">
                  {serverStatus?.currentProtocol}
                </span>
              </div>
            </div>

            <div className="w-full flex gap-2 justify-end">
              <Button
                text={restartBtnText}
                icon={RestartIcon}
                onClick={handleRestartServerBtnClick}
              />
              <Button
                text={statusText}
                icon={ExportServerIcon}
                onClick={handleStopStartBtn}
                isActive={true}
              />
            </div>
          </>
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
};
export default ServerStatus;
