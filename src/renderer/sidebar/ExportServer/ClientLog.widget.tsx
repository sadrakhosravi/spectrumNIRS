import React, { useEffect, useRef } from 'react';

import Button from '@components/Buttons/Button.component';
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '@components/Widget/Widget.component';

import TrashIcon from '@icons/trash.svg';

import { ExportServerChannels } from '@utils/channels';

const ClientLog = () => {
  const textAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.api.onIPCData(ExportServerChannels.ClientMessage, (_, msg) => {
      if (textAreaRef.current) {
        const span = document.createElement('span');
        span.className = 'my-2 px-2 break-words w-full';
        span.innerText = msg;
        textAreaRef.current.appendChild(span);
      }
    });

    return () => {
      window.api.removeListeners(ExportServerChannels.ClientMessage);
    };
  }, []);

  const handleClearBtn = () => {
    if (textAreaRef.current) {
      textAreaRef.current.innerHTML = 'Console cleared!';

      setTimeout(() => {
        //@ts-ignore
        textAreaRef.current.innerHTML = '';
      }, 1000);
    }
  };

  return (
    <Widget span="2">
      <Tabs>
        <Tabs.Tab label="Log">
          <div
            ref={textAreaRef}
            className="w-full mt-1 h-[calc(100%-0.75rem)] bg-grey2 px-4 py-2 border-primary rounded-md resize-none overflow-y-auto overflow-x-hidden flex flex-row flex-wrap break-words"
          ></div>

          <Button
            icon={TrashIcon}
            className="absolute bottom-3 right-5 border-0 bg-grey0"
            onClick={handleClearBtn}
          />
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};
export default ClientLog;
