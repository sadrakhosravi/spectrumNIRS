import type { ChannelUI } from './ChannelUI';

/**
 * Class that manages the charts UI channels.
 * Uses pure JavaScript to improve performance.
 */
export class ChannelUIManager {
  channels: ChannelUI[];
  constructor() {
    this.channels = [];
  }

  /**
   * Adds a channel to the current channel tracker array
   */
  public addChannel(channel: ChannelUI) {
    this.channels.push(channel);
  }

  public cleanup() {
    // Remove channels listeners
    this.channels.forEach((channel) => channel.dispose());

    // Clear all channels
    this.channels.length = 0;
  }
}
