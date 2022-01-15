import React, { useEffect, useState } from 'react';

import Widget from '../../components/Widget/Widget.component';
import Tabs from '@components/Tabs/Tabs.component';
import DisabledOverlay from '@components/Overlay/DisabledOverlay.component';
import ButtonMenu, {
  ButtonMenuItem,
} from '@components/Buttons/ButtonMenu.component';

// Icons
import CheckMarkIcon from '@icons/checkmark.svg';
import Separator from '@components/Separator/Separator.component';

import GlobalStore from '@lib/globalStore/GlobalStore';
import { useAppSelector } from '@redux/hooks/hooks';

const dataSize = [
  { label: 'Batch (25samples)', value: 'batch' },
  { label: 'Single Data Point', value: 'sdp' },
];
const dataTypes = [
  { label: 'JSON', value: 'JSON' },
  { label: 'String', value: 'string' },
];
const socketsToSend = [{ label: 'All Clients', value: 'all' }];

//Renders the filter widget on the sidebar
const ExportServerSettings = () => {
  const [outputDataSize, setOutputDataSize] = useState(dataSize[0]);
  const [outputDataType, setOutputDataType] = useState(dataTypes[0]);
  const [socketToSend, setSocketToSend] = useState(socketsToSend[0]);

  const streamStarted = useAppSelector(
    (state) => state.global?.exportServer?.serverStatus?.isStreamingData
  );

  useEffect(() => {
    GlobalStore.setExportServer('outputDataSize', outputDataSize.value);
    GlobalStore.setExportServer('streamTo', socketToSend.value);
    GlobalStore.setExportServer('outputDataType', outputDataType.value);
  }, []);

  useEffect(() => {
    GlobalStore.setExportServer('outputDataSize', outputDataSize.value);
  }, [outputDataSize]);

  useEffect(() => {
    GlobalStore.setExportServer('outputDataType', outputDataType.value);
  }, [outputDataType]);

  useEffect(() => {
    GlobalStore.setExportServer('streamTo', socketToSend.value);
  }, [socketToSend]);

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
          <Separator orientation="horizontal" margin="lg" />
          <div className="w-full">
            <p className="mb-2">Send Data To: </p>
            <ButtonMenu text={socketToSend.label} width="290px">
              {socketsToSend.map((socket) => (
                <ButtonMenuItem
                  key={socket.label + 'export-server-sockets-data'}
                  text={socket.label}
                  icon={
                    socketToSend.label === socket.label
                      ? CheckMarkIcon
                      : undefined
                  }
                  onClick={() => setSocketToSend(socket)}
                />
              ))}
            </ButtonMenu>
          </div>
          <Separator orientation="horizontal" margin="lg" />
          <div className="w-full">
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
