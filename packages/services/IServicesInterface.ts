export interface IServices {
  /**
   * Starts and initializes the service.
   */
  initService(): void | Promise<void>;

  /**
   * Shuts the service down.
   */
  shutdownService(): void;
}
