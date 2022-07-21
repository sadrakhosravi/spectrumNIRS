export interface IServices {
  /**
   * Starts and initializes the service.
   */
  initService(): Promise<boolean>;

  /**
   * Shuts the service down.
   */
  shutdownService(): void;
}