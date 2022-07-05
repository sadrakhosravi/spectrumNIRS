/*---------------------------------------------------------------------------------------------
 *  Calibration Toolbar View Model.
 *  Uses Mobx observable pattern.
 *  Handles the calibration toolbar UI logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// View Models
import { recordingVM } from '@store';

export class CalibrationToolbarViewModel {
  /**
   * Sends a device start signal to the reader process
   */
  public handleDeviceStart() {
    recordingVM.currentRecording?.deviceManager.startDevices();
  }

  /**
   * Sends a device start signal to the reader process
   */
  public handleDeviceStop() {
    recordingVM.currentRecording?.deviceManager.stopDevices();
  }
}
