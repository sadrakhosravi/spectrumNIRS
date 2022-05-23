/*---------------------------------------------------------------------------------------------
 *  Calibration Toolbar View Model.
 *  Uses Mobx observable pattern.
 *  Handles the calibration toolbar UI logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// IPC
import MainWinIPCService from '../../renderer/main-ui/MainWinIPCService';
import ReaderChannels from '../../utils/channels/ReaderChannels';

export class CalibrationToolbarViewModel {
  /**
   * Sends a device start signal to the reader process
   */
  public handleDeviceStart() {
    MainWinIPCService.sendToReader(ReaderChannels.START);
  }

  /**
   * Sends a device start signal to the reader process
   */
  public handleDeviceStop() {
    MainWinIPCService.sendToReader(ReaderChannels.STOP);
  }
}
