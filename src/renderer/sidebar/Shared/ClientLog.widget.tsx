import React, { useEffect, useRef } from 'react';

import Button from '@components/Buttons/Button.component';
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '@components/Widget/Widget.component';

import TrashIcon from '@icons/trash.svg';

import { GeneralChannels } from '@utils/channels';

const ClientLog = () => {
  const textAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.api.onIPCData(GeneralChannels.LogMessage, (_, data) => {
      if (textAreaRef.current) {
        const span = document.createElement('span');
        span.className = 'my-1 px-2 break-words w-full';
        span.style.color = data.color || 'white';
        span.innerText = data.message;
        textAreaRef.current.appendChild(span);
      }
    });

    return () => {
      window.api.removeListeners(GeneralChannels.LogMessage);
      //@ts-ignore
      textAreaRef.current = undefined;
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
            className="border-primary mt-1 flex h-[calc(100%-0.75rem)] w-full flex-auto flex-grow-0 resize-none flex-row flex-wrap overflow-y-auto overflow-x-hidden break-words rounded-md bg-grey2 px-4 py-2"
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
