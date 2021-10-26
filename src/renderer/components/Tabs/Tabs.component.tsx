import React, { useEffect } from 'react';

// Tabs
import { Tabs } from './Tabs';

// Components
import TabItem from '@components/Tabs/TabItem.component';
import Clock from '@components/Clock/Clock.component';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { changeAppState } from '@redux/AppStateSlice';

// Constants
import { ReviewTabChannels } from '@utils/channels';

// Recording and review tabs
const TabsContainer = () => {
  const appState = useSelector((state: any) => state.appState.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const reviewTab = document.getElementById('Review');
    const handleRightClick = () => {
      window.api.sendIPC(ReviewTabChannels.ContextMenu);
    };
    reviewTab?.addEventListener('contextmenu', handleRightClick);

    return () => {
      reviewTab?.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return (
    <>
      <div className="w-full bg-dark h-40px grid grid-flow-col auto-cols-max items-center relative">
        {Tabs.map((tab) => (
          <TabItem
            name={tab.name}
            icon={tab.icon}
            isActive={tab.isActive(appState)}
            onClick={() => dispatch(changeAppState(tab.path))}
            key={tab.name}
          />
        ))}
        <div className="absolute right-8">
          <Clock />
        </div>
      </div>
    </>
  );
};

export default TabsContainer;
