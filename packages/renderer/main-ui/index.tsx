import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Runs the startup and load the main UI.
 */
const startMainUI = async () => {
  // Load service manager
  const serviceManager = (await import('../../services/ServiceManager')).default;
  await serviceManager.init();

  console.log(await serviceManager.dbConnection.initialized);

  setTimeout(async () => {
    // Load view model store
    await import('@store');

    // Load modules
    const App = (await import('./App')).App;

    const container = document.getElementById('main') as HTMLElement;
    const root = createRoot(container);

    root.render(<App />);
  }, 100);
};

startMainUI();
