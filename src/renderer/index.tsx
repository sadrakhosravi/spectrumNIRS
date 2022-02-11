import React from 'react';
import ReactDOM from 'react-dom';

// Redux Import
import { Provider } from 'react-redux';
import store from './redux/store';

// Components
import App from './App';
import ChartProvider from './context/ChartProvider';

export const loadUI = async () => {
  const container = document.getElementById('root') as HTMLDivElement;
  container.innerHTML = '';

  ReactDOM.render(
    <React.StrictMode>
      <React.Suspense fallback={''}>
        <Provider store={store}>
          <ChartProvider>
            <App />
          </ChartProvider>
        </Provider>
      </React.Suspense>
    </React.StrictMode>,
    container
  );
};

const { ipcRenderer } = require('electron');

ipcRenderer.send('is-main-loaded');
ipcRenderer.on('main-loaded', () => loadUI());
