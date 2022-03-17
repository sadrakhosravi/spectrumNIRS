import React, { useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import Container from '@components/Containers/Container.component';

// Icons
import CopyIcon from '@icons/copy.svg';
import CheckmarkIcon from '@icons/checkmark.svg';
import Tabs from '@components/Tabs/Tabs.component';

const ServerInfo = () => {
  const [copyIconIP, setCopyIconIP] = useState(CopyIcon);
  const [copyIconPort, setCopyIconPort] = useState(CopyIcon);

  const serverInfo = useAppSelector(
    (state) => state.global.exportServer?.serverInfo
  );

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (text.includes('.')) {
      setCopyIconIP(CheckmarkIcon);
      setTimeout(() => {
        setCopyIconIP(CopyIcon);
      }, 1000);
    } else {
      setCopyIconPort(CheckmarkIcon);
      setTimeout(() => {
        setCopyIconPort(CopyIcon);
      }, 1000);
    }
  };

  return (
    <Container noPadding>
      <Tabs noBorder>
        <Tabs.Tab label="Server Information">
          <div className="py-2">
            {serverInfo &&
              serverInfo.ip &&
              serverInfo.ip.map(
                (ip, i) =>
                  i === 0 && (
                    <div
                      className="flex flex-wrap mb-6"
                      key={ip.interface + i + 'export-server'}
                    >
                      <span className="w-1/4 bg-grey2 px-2 h-full py-2">
                        Interface:{' '}
                      </span>
                      <span className="w-3/4 py-2 px-2 bg-grey1 border-b-primary">
                        {ip.interface}
                      </span>

                      <span className="w-1/4 bg-grey2 px-2 h-full py-2">
                        IP Address:
                      </span>
                      <span
                        className="w-3/4 py-2 px-2 bg-grey1 border-b-primary flex items-center gap-2 cursor-pointer"
                        title="Click to copy"
                        onClick={() => handleCopyToClipboard(ip.address)}
                      >
                        {ip.address}
                        <span>
                          <img src={copyIconIP} className="w-5" />
                        </span>
                      </span>
                      <span className="w-1/4 bg-grey2 px-2 h-full py-2">
                        Subnet Mask:
                      </span>
                      <span className="w-3/4 py-2 px-2 bg-grey1 border-b-primary">
                        {ip.netmask}
                      </span>
                      <span className="w-1/4 bg-grey2 px-2 h-full py-2">
                        Version:
                      </span>
                      <span className="w-3/4 py-2 px-2 bg-grey1 border-b-primary">
                        {ip.family}
                      </span>
                      <span className="w-1/4 bg-grey2 px-2 h-full py-2">
                        Port:
                      </span>
                      <span
                        className="w-3/4 py-2 px-2 bg-grey1 flex items-center gap-2 cursor-pointer"
                        title="Click to copy"
                        onClick={() =>
                          serverInfo.port &&
                          handleCopyToClipboard(serverInfo.port.toString())
                        }
                      >
                        {serverInfo.port || 'Failed to start the server'}
                        <span>
                          <img src={copyIconPort} className="w-5" />
                        </span>
                      </span>
                      <div className="mt-4 text-white/40">
                        Version: {serverInfo.version || 'No version available'}
                      </div>
                    </div>
                  )
              )}
          </div>
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
};
export default ServerInfo;
