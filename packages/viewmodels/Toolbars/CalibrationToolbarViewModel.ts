/*---------------------------------------------------------------------------------------------
 *  Calibration Toolbar View Model.
 *  Uses Mobx observable pattern.
 *  Handles the calibration toolbar UI logic.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// View Models
import { deviceManagerVM } from '../VMStore';

export class CalibrationToolbarViewModel {
  /**
   * Sends a device start signal to the reader process
   */
  public handleDeviceStart() {
    deviceManagerVM.initRecordingStart();
  }

  /**
   * Sends a device start signal to the reader process
   */
  public handleDeviceStop() {
    deviceManagerVM.stopRecording();
  }
}
