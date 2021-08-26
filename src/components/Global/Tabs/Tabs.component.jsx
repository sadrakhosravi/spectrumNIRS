import React from 'react';

import TabItem from '@globalComponent/Tabs/TabItem.component';

import GraphLinesIcon from '@icons/graph-lines.svg';
import ReviewIcon from '@icons/review-white.svg';
import { useSelector, useDispatch } from 'react-redux';
import { changeAppState } from '../../../redux/AppStateSlice';

//Recording and review tabs
const Tabs = () => {
  const appState = useSelector(state => state.appState.value);
  const dispatch = useDispatch();

  const recordIsActive = appState === 'record' ? true : false;
  const reviewIsActive = appState === 'review' ? true : false;

  return (
    <div className="w-full bg-dark grid grid-flow-col auto-cols-max">
      <TabItem
        text="Record"
        icon={GraphLinesIcon}
        isActive={recordIsActive}
        onClick={() => dispatch(changeAppState('record'))}
      />
      <TabItem
        text="Review"
        icon={ReviewIcon}
        isActive={reviewIsActive}
        onClick={() => dispatch(changeAppState('review'))}
      />
    </div>
  );
};

export default Tabs;
