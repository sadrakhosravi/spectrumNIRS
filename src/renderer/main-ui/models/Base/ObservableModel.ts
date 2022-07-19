import { IReactionDisposer, makeObservable } from 'mobx';

/**
 * The observable base class. Implements Mobx observables.
 */
export class ObservableModel {
  /**
   * An array to keep track of reaction disposers.
   */
  protected readonly reactions: IReactionDisposer[];

  constructor() {
    makeObservable(this);
    this.reactions = [];
  }

  /**
   * Disposes the reaction listeners and removes them from the array.
   */
  protected disposeReactions() {
    this.reactions.forEach((reaction) => reaction());
    this.reactions.length = 0;
  }
}
