import { getState } from '@redux/store';
import { DialogBoxChannels } from '@utils/channels';

/**
 * A class that exposes static methods for dealing with common UI checks/confirmations
 */
class Utilities {
  public static checkIfRecordingActive(callback?: () => any | Promise<any>) {
    let isActive = false;
    const recordState = getState().global.recordState?.recordState;

    // Recoding is active
    if (recordState === 'recording' || recordState === 'continue') {
      window.api.invokeIPC(DialogBoxChannels.MessageBox, {
        title: 'Active Recording Error',
        type: 'warning',
        message: 'You cannot access this option while recording data',
        detail:
          'To be able to access this option, please stop/pause the recording.',
      });
      isActive = true;
    }

    if (!isActive) {
      callback && callback();
    }

    return isActive;
  }

  public static checkIfRecordingNotActive(callback?: () => any | Promise<any>) {
    let isActive = true;
    const recordState = getState().global.recordState?.recordState;

    // Recoding is active
    if (recordState === 'pause' || recordState === 'idle' || !recordState) {
      window.api.invokeIPC(DialogBoxChannels.MessageBox, {
        title: 'Active Recording Error',
        type: 'warning',
        message: 'You cannot access this option without an active recording',
        detail:
          'To be able to access this option, please start/continue the recording.',
      });
      isActive = false;
    }

    if (isActive) {
      callback && callback();
    }

    return isActive;
  }
}

export default Utilities;
