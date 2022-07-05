import * as React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Runs the startup and load the main UI.
 */
const startMainUI = async () => {
  // Initialize the service first.
  const serviceManager = (await import('../../services/ServiceManager'))
    .default;
  await serviceManager.init();

  // Wait for the reader process and its port
  const globalStates = (await import('@models/App/GlobalStateModel')).default;
  await globalStates.readerPortPromise;

  setTimeout(async () => {
    // Load view model store
    await import('./viewmodels/VMStore');

    // Load modules
    const { App } = await import('./App');

    const container = document.getElementById('main') as HTMLElement;
    const root = createRoot(container);

    root.render(<App />);
  }, 100);
};

startMainUI();
