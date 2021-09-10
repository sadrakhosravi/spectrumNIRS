import React from 'react';

import TrayIcons from './TrayIcons/TrayIcons.component';

const BottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 px-2 h-30px w-full grid grid-cols-12 items-center bg-accent text-base z-50">
      <p className="ml-2 col-span-3">Software Version: 0.0.1</p>
      <span className="col-span-9 h-full">
        <TrayIcons />
      </span>
    </div>
  );
};

export default BottomBar;
