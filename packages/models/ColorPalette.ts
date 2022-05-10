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
  public readonly purple = '#B64387';
  public readonly green2 = '#00C9A7';
  public readonly yellow2 = '#FFBF5A';
  public readonly dust = '#A2ACBD';
  public readonly blue2 = '#BEFBFF';
  public readonly pink = '#BF6380';
  public readonly green3 = '#98EF8A';
  public readonly purple2 = '#7B6EBD';
  public readonly yellow3 = '#F9F871';

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
      this.purple,
      this.green2,
      this.yellow2,
      this.dust,
      this.blue2,
      this.pink,
      this.green3,
      this.purple2,
      this.yellow3,
    ];
    this.availableColorsIndex = new SortedNumberSet(
      new Array(this.colors.length).fill(0).map((_, i) => i),
    );
  }

  /**
   * @returns the next available color from the list
   */
  public getNextColor(index?: number) {
    let colorIndex = index;
    if (!colorIndex) {
      colorIndex = this.availableColorsIndex.getFirstAvailableItem();
    }
    return this.colors[colorIndex];
  }
}
