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
        onClick={window.api.minimize}
      />
      <img
        src={Restore}
        className="window-button hover:bg-accent"
        alt="Maximize/Restore"
        onClick={window.api.restore}
      />
      <img
        src={Close}
        className="window-button hover:bg-red"
        alt="Close"
        onClick={window.api.close}
      />
    </span>
  );
};

export default WindowButtons;
