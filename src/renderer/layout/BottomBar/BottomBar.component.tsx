import React from 'react';

// Components
import TrayIcons from './TrayIcons/TrayIcons.component';

import { version } from '~/package.json';

const BottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 px-2 h-30px w-full grid grid-cols-12 items-center bg-accent text-base z-50">
      <p className="ml-2 col-span-3">Software Version: {version}</p>
      <span className="col-span-9 h-30px">
        <TrayIcons />
      </span>
    </div>
  );
};

export default BottomBar;
