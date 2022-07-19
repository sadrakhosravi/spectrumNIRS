/**
 * Interface for disposable classes to free up the resources used.
 */
export interface IDisposable {
  /**
   * This method should dispose all event listeners, bindings, and should
   * free up the resources allocated by the class implementing this interface.
   * @throws if the dispose of any of the event listeners or resources was unsuccessful.
   */
  dispose(): boolean;
}
