export interface IServices {
  /**
   * Starts and initializes the service.
   */
  initService(): boolean | Promise<boolean>;

  /**
   * Shuts the service down.
   */
  shutdownService(): void;
}
