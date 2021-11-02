//Contains minimize, restore/maximize, and close button for the titlebar.

import React, { useEffect, useState } from 'react';
import Minimize from '@icons/minimize.svg';
import Restore from '@icons/restore.svg';
import Close from '@icons/close.svg';
import Maximize from '@icons/maximize.svg';

const WindowButtons = () => {
  const [isMaximized, setIsMaximized] = useState(true);

  useEffect(() => {
    window.api.onIPCData('window:unmaximize', () => {
      isMaximized && setIsMaximized(false);
    });
    window.api.onIPCData('window:maximize', () => {
      !isMaximized && setIsMaximized(true);
    });
  }, []);

  return (
    <span className="text-right items-center">
      <img
        src={Minimize}
        title="Minimize"
        className="window-button hover:bg-accent"
        alt="Minimize"
        onClick={() => window.api.sendIPC('window:minimize')}
      />
      <img
        src={isMaximized ? Restore : Maximize}
        title="Restore"
        className="window-button hover:bg-accent"
        alt="Maximize/Restore"
        onClick={() => window.api.sendIPC('window:restore')}
      />
      <img
        src={Close}
        title="Close"
        className="window-button hover:bg-red"
        alt="Close"
        onClick={() => window.api.sendIPC('window:close')}
      />
    </span>
  );
};

export default React.memo(WindowButtons);
