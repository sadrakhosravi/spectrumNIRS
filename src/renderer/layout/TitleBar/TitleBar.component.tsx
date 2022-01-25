// Controls the header/Titlebar of the app - Electron loads a frameless window.

import React, { useCallback } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import Logo from '@components/Logo/Logo.component';
import TopMenu from './TopMenu/TopMenu.component';
import WindowButtons from './WindowButtons/WindowButtons.component';

// Styles

const TitleBar = () => {
  const expName = useAppSelector(
    (state) => state.global.experiment?.currentExp?.name
  );

  const handleTitleBarDblClick = useCallback(() => {
    window.api.invokeIPC('window:maximize');
  }, []);

  return (
    <header
      className="window-drag h-[30px] w-full relative items-center grid grid-cols-3 bg-grey1 z-50"
      onDoubleClick={handleTitleBarDblClick}
    >
      <div className="h-full items-center align-middle">
        <div className="grid items-center grid-flow-col auto-cols-max h-full ">
          <div>
            <Logo />
          </div>
          <div className="ml-1">
            <TopMenu />
          </div>
        </div>
      </div>
      <div>
        <p className="text-center text-base text-white text-opacity-80">
          {expName && expName + ' -'}{' '}
          <span className="text-white text-opacity-50">Spectrum</span>
        </p>
      </div>
      <WindowButtons />
    </header>
  );
};

export default TitleBar;
