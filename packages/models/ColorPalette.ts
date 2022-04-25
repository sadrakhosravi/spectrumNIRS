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
  public readonly yellow = '#f0dd72';
  public readonly magenta = '#d95dc9';
  public readonly orange = '#e67b66';
  public readonly lightPurple = '#c5a6e6';

  /**
   * An array containing all the available colors in the color palette.
   */
  public colors: string[];
  /**
   * The array indices of all available colors.
   */
  availableColorsIndex: SortedNumberSet;

  constructor() {
    this.colors = [
      this.red,
      this.blue,
      this.green,
      this.white,
      this.yellow,
      this.magenta,
      this.orange,
      this.lightPurple,
    ];
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
