import React, { useEffect, useRef } from 'react';

import Button from '@components/Buttons/Button.component';
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '@components/Widget/Widget.component';

import TrashIcon from '@icons/trash.svg';

import { ExportServerChannels } from '@utils/channels';

const ClientLog = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    window.api.onIPCData(ExportServerChannels.ClientMessage, (_, msg) => {
      if (textAreaRef.current) {
        textAreaRef.current.value += msg + '\n';
      }
      console.log(msg);
    });

    return () => {
      window.api.removeListeners(ExportServerChannels.ClientMessage);
    };
  }, []);

  const handleClearBtn = () => {
    if (textAreaRef.current) {
      textAreaRef.current.value = 'Console cleared!';

      setTimeout(() => {
        //@ts-ignore
        textAreaRef.current.value = '';
      }, 1000);
    }
  };

  return (
    <Widget span="2">
      <Tabs>
        <Tabs.Tab label="Log">
          <textarea
            ref={textAreaRef}
            className="w-full mt-1 h-[calc(100%-0.75rem)] bg-grey2 px-4 py-2 border-primary rounded-md resize-none "
            disabled
          ></textarea>
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
