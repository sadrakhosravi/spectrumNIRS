//@ts-nocheck

import { ipcRenderer } from 'electron';
import * as React from 'react';

// IPC Channels
import { ErrorChannels } from '@utils/channels';

// Components
import { DialogBox } from '../Elements/DialogBox';

export const ErrorDialogs = () => {
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    window.onerror = (_event, _source, _, __, error) => {
      setError(error);
      setIsDialogOpen(true);
    };

    // Listen for errors from other processes.
    ipcRenderer.on(ErrorChannels.MAIN_PROCESS_ERROR, (_, message: string) => {
      console.log('Message');
      setError(new Error(message));
      setIsDialogOpen(true);
    });

    process.on('uncaughtException', () => console.log('Exception'));

    return () => {
      ipcRenderer.removeAllListeners(ErrorChannels.MAIN_PROCESS_ERROR);
    };
  }, []);

  return (
    <>
      {isDialogOpen && (
        <DialogBox
          title="Error"
          isOpen={isDialogOpen}
          type="error"
          closeSetter={setIsDialogOpen}
        >
          <div>
            <span>{error?.message}</span>
            <span>Cause: {error?.cause?.toString() || 'Unknown'}</span>
          </div>
        </DialogBox>
      )}
    </>
  );
};
