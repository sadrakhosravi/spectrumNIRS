import React from 'react';
import ReactDOM from 'react-dom';

// Redux Import
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './App';
import ChartProvider from './context/ChartProvider';

const container = document.getElementById('root') as HTMLDivElement;
container.innerHTML = '';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChartProvider>
        <App />
      </ChartProvider>
    </Provider>
  </React.StrictMode>,
  container
);
