import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

// Components
import HomeIconButton from './IconButtons/HomeIconButton.component';
import RecordIconButton from './IconButtons/RecordIconButton.component';
import ReviewIconButton from './IconButtons/ReviewIconButton.component';
import SettingsIconButton from './IconButtons/SettingsIconButton.component';
import ExperimentSettings from 'renderer/settings/ExperimentSettings.component';

// State
import { changeAppState } from '@redux/AppStateSlice';
import { openModal } from '@redux/ModalStateSlice';
import { ModalConstants } from 'utils/constants';

// Constants
import { AppState } from 'utils/constants';
import ProbeCalibrationButton from './IconButtons/ProbeCalibrationButton';

const MainNavigation = (): JSX.Element => {
  const appState = useSelector((state: any) => state.appState.value);

  const dispatch = useDispatch();

  let navIcons;
  // Check app state and set the active menu button accordingly.
  switch (appState) {
    case AppState.HOME:
      navIcons = (
        <>
          <HomeIconButton
            onClick={() => dispatch(changeAppState(AppState.HOME))}
            isActive
          />
          <RecordIconButton
            onClick={() => dispatch(changeAppState(AppState.RECORD))}
          />
          <ReviewIconButton
            onClick={() => dispatch(changeAppState(AppState.REVIEW))}
          />
          <ProbeCalibrationButton
            onClick={() => dispatch(changeAppState(AppState.PROBE_CALIBRATION))}
          />
        </>
      );
      break;

    case AppState.RECORD:
      navIcons = (
        <>
          <HomeIconButton
            onClick={() => dispatch(changeAppState(AppState.HOME))}
          />
          <RecordIconButton
            onClick={() => dispatch(changeAppState(AppState.RECORD))}
            isActive
          />
          <ReviewIconButton
            onClick={() => dispatch(changeAppState(AppState.REVIEW))}
          />
          <ProbeCalibrationButton
            onClick={() => dispatch(changeAppState(AppState.PROBE_CALIBRATION))}
          />
        </>
      );
      break;

    case AppState.REVIEW:
      navIcons = (
        <>
          <HomeIconButton
            onClick={() => dispatch(changeAppState(AppState.HOME))}
          />
          <RecordIconButton
            onClick={() => dispatch(changeAppState(AppState.RECORD))}
          />
          <ReviewIconButton
            onClick={() => dispatch(changeAppState(AppState.REVIEW))}
            isActive
          />
          <ProbeCalibrationButton
            onClick={() => dispatch(changeAppState(AppState.PROBE_CALIBRATION))}
          />
        </>
      );
      break;
    case AppState.PROBE_CALIBRATION:
      navIcons = (
        <>
          <HomeIconButton
            onClick={() => dispatch(changeAppState(AppState.HOME))}
          />
          <RecordIconButton
            onClick={() => dispatch(changeAppState(AppState.RECORD))}
          />
          <ReviewIconButton
            onClick={() => dispatch(changeAppState(AppState.REVIEW))}
          />
          <ProbeCalibrationButton
            onClick={() => dispatch(changeAppState(AppState.PROBE_CALIBRATION))}
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

export default React.memo(MainNavigation);
