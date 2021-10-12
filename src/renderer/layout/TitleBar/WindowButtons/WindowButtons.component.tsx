//Contains minimize, restore/maximize, and close button for the titlebar.

import React from 'react';
import Minimize from '@icons/minimize.svg';
import Restore from '@icons/restore.svg';
import Close from '@icons/close.svg';

const WindowButtons = () => {
  return (
    <span className="text-right items-center">
      <img
        src={Minimize}
        className="window-button hover:bg-accent"
        alt="Minimize"
        onClick={window.api.window.minimize}
      />
      <img
        src={Restore}
        className="window-button hover:bg-accent"
        alt="Maximize/Restore"
        onClick={window.api.window.restore}
      />
      <img
        src={Close}
        className="window-button hover:bg-red"
        alt="Close"
        onClick={window.api.window.close}
      />
    </span>
  );
};

export default WindowButtons;
