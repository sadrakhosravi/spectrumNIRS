import React, { useEffect, useRef } from 'react';

import Button from '@components/Buttons/Button.component';
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '@components/Widget/Widget.component';

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
    if (textAreaRef.current) textAreaRef.current.value = '';
  };

  return (
    <Widget span="3">
      <Tabs>
        <Tabs.Tab label="Log">
          <textarea
            ref={textAreaRef}
            className="w-full mt-1 h-[calc(100%-0.75rem)] bg-grey2 px-4 py-2 border-primary rounded-md resize-none "
            disabled
          ></textarea>
          <Button
            text="Clear"
            className="absolute top-2 right-6"
            onClick={handleClearBtn}
          />
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};
export default ClientLog;
