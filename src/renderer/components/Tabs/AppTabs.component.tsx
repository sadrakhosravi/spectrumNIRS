import React, { useEffect } from 'react';

// Tabs
import { Tabs } from './Tabs';

// Components
import TabItem from '@components/Tabs/TabItem.component';

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { changeAppState, setReviewTabInNewWindow } from '@redux/AppStateSlice';

// Constants
import { ReviewTabChannels } from '@utils/channels';

// Recording and review tabs
const TabsContainer = () => {
  const appState = useAppSelector((state) => state.appState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.api.onIPCData(
      ReviewTabChannels.IsNewWindowOpened,
      (_event, data: boolean) => {
        dispatch(setReviewTabInNewWindow(data));
      }
    );
    const reviewTab = document.getElementById('Review');
    const handleRightClick = () => {
      window.api.sendIPC(
        ReviewTabChannels.ContextMenu,
        appState.reviewTabInNewWindow
      );
    };
    reviewTab?.addEventListener('contextmenu', handleRightClick);

    return () => {
      reviewTab?.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return (
    <>
      <div className="w-full h-40px pl-4 grid grid-flow-col auto-cols-max items-center relative">
        {Tabs.map((tab) => (
          <TabItem
            name={tab.name}
            icon={tab.icon}
            isActive={tab.isActive(appState.value)}
            onClick={() => dispatch(changeAppState(tab.path))}
            key={tab.name}
          />
        ))}
        <div className="absolute right-8"></div>
      </div>
    </>
  );
};

export default TabsContainer;
