import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Components
import HomeIconButton from './IconButtons/HomeIconButton.component';
import SignalIconButton from './IconButtons/SignalIconButton.component';
import ReviewIconButton from './IconButtons/ReviewIconButton.component';

// State
import { changeAppState } from '../../redux/AppStateSlice';

const MainNavigation = () => {
  const appState = useSelector((state: any) => state.appState.value);
  const dispatch = useDispatch();

  const history = useHistory();

  // Check app state and redirect accordingly.
  useEffect(() => {
    history.push(`${appState}`);
  }, [appState, history]);
  let navIcons;

  // Check app state and set the active menu button accordingly.
  switch (appState) {
    case 'home':
      navIcons = (
        <>
          <HomeIconButton
            onClick={() => dispatch(changeAppState('home'))}
            isActive
          />
          <SignalIconButton
            onClick={() => dispatch(changeAppState('record'))}
          />
          <ReviewIconButton
            onClick={() => dispatch(changeAppState('review'))}
          />
        </>
      );
      break;
    case 'record':
      navIcons = (
        <>
          <HomeIconButton onClick={() => dispatch(changeAppState('home'))} />
          <SignalIconButton
            onClick={() => dispatch(changeAppState('record'))}
            isActive
          />
          <ReviewIconButton
            onClick={() => dispatch(changeAppState('review'))}
          />
        </>
      );
      break;

    case 'review':
      navIcons = (
        <>
          <HomeIconButton onClick={() => dispatch(changeAppState('home'))} />
          <SignalIconButton
            onClick={() => dispatch(changeAppState('record'))}
          />
          <ReviewIconButton
            onClick={() => dispatch(changeAppState('review'))}
            isActive
          />
        </>
      );
      break;

    default:
      navIcons = null;
      break;
  }

  return <div className="main-navigation text-center">{navIcons}</div>;
};

export default MainNavigation;
