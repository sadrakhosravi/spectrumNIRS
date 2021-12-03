//Contains minimize, restore/maximize, and close button for the titlebar.

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';

// Icons
import Minimize from '@icons/minimize.svg';
import Restore from '@icons/restore.svg';
import Close from '@icons/close.svg';
import Maximize from '@icons/maximize.svg';
import { setWindowResized } from '@redux/AppStateSlice';

const WindowButtons = () => {
  const [isMaximized, setIsMaximized] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.api.onIPCData('window:unmaximize', () => {
      setIsMaximized(false);
    });
    window.api.onIPCData('window:maximize', () => {
      console.log('Maximize');

      setIsMaximized(true);
    });
  }, []);

  useEffect(() => {
    window.api.onIPCData('window:resize', () => {
      dispatch(setWindowResized(Math.random()));
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
