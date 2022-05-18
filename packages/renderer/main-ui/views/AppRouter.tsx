import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { LeftPanel } from '../components/LeftPanel';
import { StatusBar } from '../components/StatusBar';

// Views
import { ViewRouter } from './ViewRouter';
import { HomeView } from './Home';
import { CreateNewRecording } from '../components/Recordings';

// View Models
import { appRouterVM } from '@store';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

export const AppRouter = observer(() => {
  return (
    <>
      {/* Main Container */}
      <div className="main-container">
        {/* Show app dashboard */}
        {!appRouterVM.route.includes('home') && (
          <>
            <LeftPanel />
            <div className="view-container">
              <ViewRouter />
              <div className="statusbar-container">
                <StatusBar />
              </div>
            </div>
          </>
        )}

        {/* Home Screen */}
        {appRouterVM.route === AppNavStatesEnum.HOME && <HomeView />}
        {appRouterVM.route === AppNavStatesEnum.NEW_RECORDING && <CreateNewRecording />}
      </div>
    </>
  );
});
