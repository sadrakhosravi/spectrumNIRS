import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import TrayIcons from './TrayIcons/TrayIcons.component';
import ToastNotifications from '@components/Toast/ToastNotifications.component';

// Icons
import UpdateIcon from '@icons/update.svg';

import { version } from '~/package.json';

const BottomBar = () => {
  const isLoadingData = useAppSelector((state) => state.appState.isLoadingData);
  return (
    <>
      <div className="fixed bottom-0 left-0 px-2 h-30px w-full grid grid-cols-12 items-center bg-accent text-base z-50">
        <div className="ml-2 col-span-3 flex items-center">
          <p className="mr-6">Software Version: {version}</p>
          {isLoadingData && (
            <div className="flex items-center">
              <img
                src={UpdateIcon}
                className="motion-safe:animate-spin mr-2"
                width="24px"
                style={{
                  animationDuration: '2s',
                  animationDirection: 'reverse',
                }}
              />
              <p>Loading Data...</p>
            </div>
          )}
        </div>
        <span className="col-span-9 h-30px">
          <TrayIcons />
        </span>
      </div>
      <ToastNotifications />
    </>
  );
};

export default BottomBar;
