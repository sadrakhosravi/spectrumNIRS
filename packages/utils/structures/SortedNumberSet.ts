/**
 * Custom set based on arrays for easier manipulation
 * Not targeted for performance.
 * @author Sadra Khosravi
 */

/**
 * Creates a custom set with custom functionalities based on
 * javascript arrays.
 * @version 0.1.0
 */
export class SortedNumberSet {
  private array: number[];

  constructor(_array: number[]) {
    this.array = _array;

    this.removedDuplicates();
    this.sortSet();
  }

  /**
   * Gets the first available item of the sorted set.
   */
  public getFirstAvailableItem() {
    const firstAvailableItem = this.array[0];
    this.removeItemFromSet(0);
    return firstAvailableItem;
  }

  /**
   * Gets the last available item of the sorted set.
   */
  public getLastAvailableItem() {
    return this.array[this.array.length - 1];
  }

  /**
   * @returns the sorted number set as array
   */
  public getSortedSet() {
    return this.array;
  }

  /**
   * Adds an item to the set and sorts it.
   * @returns The entire sorted set as array.
   */
  public addItemToSet(item: number) {
    this.array.push(item);

    this.removedDuplicates();
    this.sortSet();

    return this.getSortedSet;
  }

  /**
   * Removes an item to the set and sorts it.
   * @returns The entire sorted set as array.
   */
  public removeItemFromSet(index: number) {
    this.array.splice(index, 1);
    this.sortSet();

    return this.getSortedSet;
  }

  /**
   * Sorts the number set from smallest to largest.
   */
  private sortSet() {
    this.array.sort((a, b) => a - b);
  }

  /**
   * Removes duplicates of the current array(set).
   */
  private removedDuplicates() {
    const removedDuplicates = new Set(this.array);
    this.array = [...removedDuplicates];
  }
}
