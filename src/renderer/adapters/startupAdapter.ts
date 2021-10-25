import { StartupChannels } from '../../utils/channels';

/**
 * Sends a signal to the main process indicating the renderer is ready.
 */
export const sendStartupConfirmation = () => {
  window.api.sendIPC(StartupChannels.Ready);
};
