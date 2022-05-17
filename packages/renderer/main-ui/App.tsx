import React from 'react';
import { observer } from 'mobx-react-lite';

// // Components
import { TitleBar } from '/@/components/TitleBar';
import { LeftPanel } from '/@/components/LeftPanel';
import { StatusBar } from '/@/components/StatusBar';
import { ErrorDialogs } from './components/ErrorDialogs/ErrorDialogs';

// Global styles
import './styles/main.scss';
import 'tippy.js/dist/tippy.css'; // optional

// Screens
import { ViewRouter } from './views';
import { HomeView } from './views';
import { Loader } from './components/Elements/Loader';

// View Models
import { appRouterVM } from '@store';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

export const App = observer(() => {
  return (
    <div className="main-window">
      <TitleBar />

      {/* Loading State */}
      {appRouterVM.isLoading && <Loader />}

      {/* Main Container */}
      <div className="main-container">
        {appRouterVM.route !== 'home' && (
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
      </div>

      {/* Error Popups */}
      <ErrorDialogs />
    </div>
  );
});
