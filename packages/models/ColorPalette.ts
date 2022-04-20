/*---------------------------------------------------------------------------------------------
 *  Color Palette Model.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { SortedNumberSet } from '../utils/structures/SortedNumberSet';

export class ColorPalette {
  // Color definitions
  public readonly red = '#E3170A';
  public readonly blue = '#00FFFF';
  public readonly green = '#ABFF4F';
  public readonly white = '#FFFFFF';

  /**
   * An array containing all the available colors in the color palette.
   */
  public colors: string[];
  /**
   * The array indices of all available colors.
   */
  availableColorsIndex: SortedNumberSet;

  constructor() {
    this.colors = [this.red, this.blue, this.green, this.white];
    this.availableColorsIndex = new SortedNumberSet(
      new Array(this.colors.length).fill(0).map((_, i) => i),
    );
  }

  /**
   * @returns the next available color from the list
   */
  public getNextColor() {
    const index = this.availableColorsIndex.getFirstAvailableItem();
    return this.colors[index];
  }
}
