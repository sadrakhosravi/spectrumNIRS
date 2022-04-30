import React from 'react';

// // Components
import { TitleBar } from '/@/components/TitleBar';
import { LeftPanel } from '/@/components/LeftPanel';
import { StatusBar } from '/@/components/StatusBar';

// Global styles
import './styles/tailwind.css';
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
    </div>
  );
};

export default App;
