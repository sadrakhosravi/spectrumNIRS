class FixedStack {
  stack: number[];

  constructor(size: number) {
    this.stack = new Array(size).fill(0);
  }

  /**
   * Adds data to the stack and shifts the array to keep
   * the stack size consistent
   */
  public push(data: number) {
    this.stack.push(data);
    this.stack.shift();
  }

  /**
   * @returns the item at the given index
   */
  public peekAt(index: number) {
    return this.stack[index];
  }

  /**
   * @returns the entire stack as an array
   */
  public getItems() {
    return this.stack;
  }

  /**
   * Removes all elements of the stack permanently
   */
  public emptyStack() {
    this.stack.length = 0;
  }
}

export default FixedStack;
