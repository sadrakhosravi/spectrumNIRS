import React from 'react';

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

const App = () => {
  return (
    <div className="main-window">
      <TitleBar />
      <div className="main-container">
        <LeftPanel />

        <div className="view-container">
          <ViewRouter />
          <div className="statusbar-container">
            <StatusBar />
          </div>
        </div>
      </div>

      {/* Error Popups */}
      <ErrorDialogs />
    </div>
  );
};

export default App;
