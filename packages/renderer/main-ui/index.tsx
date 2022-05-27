import React from 'react';
import { createRoot } from 'react-dom/client';

// Global states
import '@models/App/GlobalStateModel';

// Start Service Manager
import '../../services/ServiceManager';

// View Model Store
import '@store';

// Data
import '@models/Data/DataManagerModel';

// IPC Service
import './MainWinIPCService';

// Components
import { App } from './App';

setTimeout(() => {
  const container = document.getElementById('main') as HTMLElement;
  const root = createRoot(container);

  root.render(<App />);
}, 200);
