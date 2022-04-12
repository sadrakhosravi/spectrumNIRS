import React from 'react';

// // Components
// import { TitleBar } from '/@/components/TitleBar';
// import { LeftPanel } from '/@/components/LeftPanel';
// import { StatusBar } from '/@/components/StatusBar';

// Global styles
import './styles/main.scss';

// Screens
// import { HomeScreen } from '/@/views';

const App = () => {
  return (
    <div className="main-window">
      {/* <TitleBar />
      <LeftPanel /> */}

      <div className="content-container">
        <div className="view-container"></div>
        <div className="statusbar-container">{/* <StatusBar /> */}</div>
      </div>
    </div>
  );
};

export default App;
