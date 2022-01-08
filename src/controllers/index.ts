// Controllers
import startup from './startup';
(async () => {
  await startup();
  await import('./window');
  await import('./experiment');
  await import('./recording');
  await import('./reviewTab');
  await import('./dialogBox');
  await import('./usbDetection');
  await import('./probes');
  await import('./chart');
  await import('./settingsWindow');
  await import('./others');
})();
