/**
 * Generic History Manager for managing Undo/Redo stacks.
 * Follows the Command pattern principles for state management.
 */
export class HistoryManager<T> {
  private past: T[] = [];
  private future: T[] = [];
  private limit: number;

  constructor(limit: number = 50) {
    this.limit = limit;
  }

  /**
   * Pushes a new state into the history stack.
   * Clears the future stack as a new timeline branch is created.
   * Maintains the stack size within the defined limit.
   */
  public push(state: T): void {
    if (this.past.length >= this.limit) {
      this.past.shift(); // Remove oldest state
    }
    this.past.push(state);
    this.future = []; // Clear redo stack
  }

  /**
   * Reverts to the previous state.
   * @param currentState The current state (to be pushed to future)
   * @returns The previous state, or null if no history exists.
   */
  public undo(currentState: T): T | null {
    if (this.past.length === 0) return null;

    const previousState = this.past.pop();
    if (previousState) {
      this.future.push(currentState);
      return previousState;
    }
    return null;
  }

  /**
   * Reapplies a previously undone state.
   * @param currentState The current state (to be pushed to past)
   * @returns The next state, or null if no redo exists.
   */
  public redo(currentState: T): T | null {
    if (this.future.length === 0) return null;

    const nextState = this.future.pop();
    if (nextState) {
      this.past.push(currentState);
      return nextState;
    }
    return null;
  }

  /**
   * Checks if undo is available.
   */
  public get canUndo(): boolean {
    return this.past.length > 0;
  }

  /**
   * Checks if redo is available.
   */
  public get canRedo(): boolean {
    return this.future.length > 0;
  }

  /**
   * Clears all history.
   */
  public clear(): void {
    this.past = [];
    this.future = [];
  }
}
