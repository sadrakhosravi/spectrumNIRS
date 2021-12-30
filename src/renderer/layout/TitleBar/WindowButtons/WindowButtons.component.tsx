//Contains minimize, restore/maximize, and close button for the titlebar.

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

// Icons
import Minimize from '@icons/minimize.svg';
import Restore from '@icons/restore.svg';
import Close from '@icons/close.svg';
import Maximize from '@icons/maximize.svg';
import { setWindowMaximized, setWindowResized } from '@redux/AppStateSlice';

const WindowButtons = () => {
  const isWindowMaximized = useAppSelector(
    (state) => state.appState.windowMaximized
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.api.onIPCData('window:unmaximize', () => {
      dispatch(setWindowMaximized(false));
    });
    window.api.onIPCData('window:maximize', () => {
      dispatch(setWindowMaximized(true));
    });
  }, []);

  useEffect(() => {
    window.api.onIPCData('window:resize', () => {
      dispatch(setWindowResized(Math.random()));
    });

    return () => window.api.removeListeners('window:resize');
  }, []);

  return (
    <span className="text-right items-center window-drag">
      <img
        src={Minimize}
        title="Minimize"
        className="window-button hover:bg-accent "
        alt="Minimize"
        onClick={() => window.api.sendIPC('window:minimize')}
      />
      <img
        src={isWindowMaximized ? Restore : Maximize}
        title={isWindowMaximized ? 'Restore' : 'Maximize'}
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
