import React, { useEffect, useState } from 'react';

import Widget from '../../components/Widget/Widget.component';
import Tabs from '@components/Tabs/Tabs.component';
import DisabledOverlay from '@components/Overlay/DisabledOverlay.component';
import ButtonMenu, {
  ButtonMenuItem,
} from '@components/Buttons/ButtonMenu.component';

// Icons
import CheckMarkIcon from '@icons/checkmark.svg';
// import Separator from '@components/Separator/Separator.component';

import GlobalStore from '@lib/globalStore/GlobalStore';
import { useAppSelector } from '@redux/hooks/hooks';

import {
  IDataSize,
  IDataTypes,
} from '@electron/models/exportServer/ExportServer';

//Renders the filter widget on the sidebar
const ExportServerSettings = () => {
  const clientStatus = useAppSelector(
    (state) => state.global.exportServer?.clientStatus
  );
  const streamStarted = useAppSelector(
    (state) => state.global?.exportServer?.serverStatus?.isStreamingData
  );
  const sendTo = useAppSelector((state) => state.global.exportServer?.sendTo);

  const dataSize: IDataSize[] = [
    { label: 'Batch (25samples)', value: 'batch' },
    { label: 'Single Data Point', value: 'sdp' },
  ];
  const dataTypes: IDataTypes[] = [
    { label: 'JSON', value: 'JSON' },
    { label: 'String', value: 'string' },
  ];

  const [outputDataSize, setOutputDataSize] = useState(dataSize[0]);
  const [outputDataType, setOutputDataType] = useState(dataTypes[0]);

  useEffect(() => {
    GlobalStore.setExportServer('outputDataSize', outputDataSize.value);
    GlobalStore.setExportServer('sendTo', 'All Clients');
    GlobalStore.setExportServer('outputDataType', outputDataType.value);
  }, []);

  useEffect(() => {
    GlobalStore.setExportServer('outputDataSize', outputDataSize.value);
  }, [outputDataSize]);

  useEffect(() => {
    GlobalStore.setExportServer('outputDataType', outputDataType.value);
  }, [outputDataType]);

  console.log(sendTo);
  // Handles the send to option
  const handleSendTo = (name: string) =>
    GlobalStore.setExportServer('sendTo', name);

  return (
    <Widget span="3">
      <Tabs>
        <Tabs.Tab label="Settings">
          <>
            {streamStarted && (
              <DisabledOverlay title="You cannot access settings while the data stream is active" />
            )}
          </>
          <div className="pt-1 w-full">
            <p className="mb-2">Output Data Size: </p>
            <ButtonMenu text={outputDataSize.label} width="290px">
              {dataSize.map((size) => (
                <ButtonMenuItem
                  key={size.label + 'export-server-data-size'}
                  text={size.label}
                  icon={
                    size.label === outputDataSize.label
                      ? CheckMarkIcon
                      : undefined
                  }
                  onClick={() => setOutputDataSize(size)}
                />
              ))}
            </ButtonMenu>
          </div>
          <div className="w-full mt-4">
            <p className="mb-2">Send Data To: </p>
            <ButtonMenu text={sendTo || 'All Clients'} width="290px">
              <>
                <ButtonMenuItem
                  key={'All Clients' + 'export-server-sockets-data'}
                  text={'All Clients'}
                  icon={sendTo === 'All Clients' ? CheckMarkIcon : undefined}
                  onClick={() => handleSendTo('All Clients')}
                />
                {clientStatus?.map(
                  (socket) =>
                    socket.status === 'Open' && (
                      <ButtonMenuItem
                        key={socket.appName + 'export-server-sockets-data'}
                        text={socket.appName}
                        icon={
                          sendTo === socket.appName ? CheckMarkIcon : undefined
                        }
                        onClick={() => handleSendTo(socket.appName as string)}
                      />
                    )
                )}
              </>
            </ButtonMenu>
          </div>
          <div className="w-full mt-4">
            <p className="mb-2">Output Data Type: </p>
            <ButtonMenu text={outputDataType.label} width="290px">
              {dataTypes.map((type) => (
                <ButtonMenuItem
                  key={type.label + 'export-server-data-type'}
                  text={type.label}
                  icon={
                    outputDataType.label === type.label
                      ? CheckMarkIcon
                      : undefined
                  }
                  onClick={() => setOutputDataType(type)}
                />
              ))}
            </ButtonMenu>
          </div>
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};

export default ExportServerSettings;
