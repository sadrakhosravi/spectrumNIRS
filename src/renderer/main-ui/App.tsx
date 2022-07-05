import * as React from 'react';

// Components
import { TitleBar } from '/@/components/TitleBar';
import { ErrorDialogs } from './components/ErrorDialogs/ErrorDialogs';

// Global styles
import './styles/main.scss';
import 'tippy.js/dist/tippy.css'; // optional

// View Models
import { AppRouter } from './views/AppRouter';

export const App = () => {
  return (
    <div className="main-window">
      <TitleBar />

      {/* Router */}
      <AppRouter />

      {/* Error Popups */}
      <ErrorDialogs />
    </div>
  );
};
