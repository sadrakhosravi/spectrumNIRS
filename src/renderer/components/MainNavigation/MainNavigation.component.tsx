import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

// Components
import HomeIconButton from './IconButtons/HomeIconButton.component';
import SignalIconButton from './IconButtons/SignalIconButton.component';
import ReviewIconButton from './IconButtons/ReviewIconButton.component';
import SettingsIconButton from './IconButtons/SettingsIconButton.component';
import ExperimentSettings from '@components/ExperimentSettings/ExperimentSettings.component';

// State
import { changeAppState } from '@redux/AppStateSlice';
import { openModal } from '@redux/ModalStateSlice';
import { ModalConstants } from 'renderer/constants/Constants';

const MainNavigation = () => {
  const appState = useSelector((state: any) => state.appState.value);

  const dispatch = useDispatch();

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

  return (
    <div className="main-navigation text-center">
      <div className="relative h-full">
        {navIcons}
        <div className="absolute bottom-0">
          <SettingsIconButton
            onClick={() =>
              dispatch(openModal(ModalConstants.EXPERIMENTSETTINGS))
            }
          />
          <ExperimentSettings />
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
