import React from 'react';

//Components
import HomeIconButton from './IconButtons/HomeIconButton.component';
import SignalIconButton from './IconButtons/SignalIconButton.component';
import ReviewIconButton from './IconButtons/ReviewIconButton.component';

//Styles
import styles from './MainNavigation.module.css';

//State
import { useSelector, useDispatch } from 'react-redux';
import { changeAppState } from '../../redux/AppStateSlice';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

const MainNavigation = () => {
  const appState = useSelector(state => state.appState.value);
  const dispatch = useDispatch();

  const history = useHistory();

  //Check app state and redirect accordingly.
  useEffect(() => {
    history.push(`${appState}`);
  }, [appState, history]);
  let navIcons;

  //Check app state and set the active menu button accordingly.
  switch (appState) {
    case 'home':
      navIcons = (
        <>
          <HomeIconButton onClick={() => dispatch(changeAppState('home'))} isActive={true} />
          <SignalIconButton onClick={() => dispatch(changeAppState('record'))} />
          <ReviewIconButton onClick={() => dispatch(changeAppState('review'))} />
        </>
      );
      break;
    case 'record':
      navIcons = (
        <>
          <HomeIconButton onClick={() => dispatch(changeAppState('home'))} />
          <SignalIconButton onClick={() => dispatch(changeAppState('record'))} isActive={true} />
          <ReviewIconButton onClick={() => dispatch(changeAppState('review'))} />
        </>
      );
      break;

    case 'review':
      navIcons = (
        <>
          <HomeIconButton onClick={() => dispatch(changeAppState('home'))} />
          <SignalIconButton onClick={() => dispatch(changeAppState('record'))} />
          <ReviewIconButton onClick={() => dispatch(changeAppState('review'))} isActive={true} />
        </>
      );
      break;

    default:
      navIcons = null;
      break;
  }

  return <div className={`${styles.MainNavigation} text-center`}>{navIcons}</div>;
};

export default MainNavigation;
