import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

// Components
import HomeIconButton from './IconButtons/HomeIconBtn.nav';
import RecordIconButton from './IconButtons/RecordIconBtn.nav';
import ReviewIconButton from './IconButtons/ReviewIconButton.nav';
import SettingsIconButton from './IconButtons/SettingsIconBtn.nav';
import ExportServerButton from './IconButtons/ExportServerIconBtn.nav';

// State
import { changeAppState } from '@redux/AppStateSlice';
import { openModal } from '@redux/ModalStateSlice';
import { ModalConstants } from 'utils/constants';

// Constants
import { AppState } from 'utils/constants';
import ProbeCalibrationButton from './IconButtons/ProbeCalibrationIconBtn.nav';

const MainNavigation = (): JSX.Element => {
  const appState = useSelector((state: any) => state.appState.value);
  const dispatch = useDispatch();

  return (
    <div className="top-30px absolute left-0 z-0 h-[calc(100%-60px)] w-[45px] bg-grey2 text-center">
      <div className="relative h-full">
        <HomeIconButton
          onClick={() => dispatch(changeAppState(AppState.HOME))}
          isActive={appState === AppState.HOME}
        />
        <RecordIconButton
          onClick={() => dispatch(changeAppState(AppState.RECORD))}
          isActive={appState === AppState.RECORD}
        />
        <ReviewIconButton
          onClick={() => dispatch(changeAppState(AppState.REVIEW))}
          isActive={appState === AppState.REVIEW}
        />
        <ProbeCalibrationButton
          onClick={() => dispatch(changeAppState(AppState.PROBE_CALIBRATION))}
          isActive={appState === AppState.PROBE_CALIBRATION}
        />
        <ExportServerButton
          onClick={() => dispatch(changeAppState(AppState.EXPORT_SERVER))}
          isActive={appState === AppState.EXPORT_SERVER}
        />

        <div className="absolute bottom-0">
          <SettingsIconButton
            onClick={() =>
              dispatch(openModal(ModalConstants.EXPERIMENTSETTINGS))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MainNavigation);
