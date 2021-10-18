import React, { useEffect } from 'react';

// Components
import TabItem from '@components/Tabs/TabItem.component';
import Clock from '@components/Clock/Clock.component';

// Icons
import GraphLinesIcon from '@icons/graph-lines.svg';
import ReviewIcon from '@icons/review-white.svg';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { changeAppState } from '@redux/AppStateSlice';

// Constants
import { AppState } from '@constants/constants';

// Recording and review tabs
const Tabs = () => {
  const appState = useSelector((state: any) => state.appState.value);
  const dispatch = useDispatch();

  const recordIsActive = appState === AppState.RECORD;
  const reviewIsActive = appState === AppState.REVIEW;

  useEffect(() => {
    const reviewTab = document.getElementById('Review');
    const handleRightClick = () => {
      window.api.contextMenu.reviewTab();
    };
    reviewTab?.addEventListener('contextmenu', handleRightClick);

    return () => {
      reviewTab?.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return (
    <>
      <div className="w-full bg-dark grid grid-flow-col auto-cols-max items-center relative">
        <TabItem
          text="Record"
          icon={GraphLinesIcon}
          isActive={recordIsActive}
          onClick={() => dispatch(changeAppState(AppState.RECORD))}
        />
        <TabItem
          text="Review"
          icon={ReviewIcon}
          isActive={reviewIsActive}
          onClick={() => dispatch(changeAppState(AppState.REVIEW))}
        />
        <div className="absolute right-8">
          <Clock />
        </div>
      </div>
    </>
  );
};

export default Tabs;
