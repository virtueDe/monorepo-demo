export interface HistoryItem<T> {
  state: T;
  action: string;
  timestamp: number;
}

export class UndoRedoManager<T> {
  private history: HistoryItem<T>[] = [];
  private future: HistoryItem<T>[] = [];
  private currentState: T;
  private maxHistoryLength: number;

  constructor(initialState: T, maxHistoryLength: number = 50) {
    this.currentState = initialState;
    this.maxHistoryLength = maxHistoryLength;
  }

  saveState(newState: T, action: string) {
    // const diff = this.getStateDiff(this.currentState, newState);
    if (Object.keys(newState as object).length > 0) {
      const historyItem: HistoryItem<T> = {
        state: this.currentState, // 保存当前状态，而不是新状态
        action: action,
        timestamp: Date.now()
      };
      this.history.push(historyItem);
      if (this.history.length > this.maxHistoryLength) {
        this.history.shift();
      }
      this.future = [];
      this.currentState = newState; // 更新当前状态为新状态
    }
  }

  undo(): T | null {
    if (this.history.length === 0) return null;

    const lastItem = this.history.pop()!;
    this.future.unshift({
      state: this.currentState,
      action: `Undo ${lastItem.action}`,
      timestamp: Date.now()
    });
    this.currentState = lastItem.state; // 直接使用历史状态
    return this.currentState;
  }

  redo(): T | null {
    if (this.future.length === 0) return null;

    const nextItem = this.future.shift()!;
    this.history.push({
      state: this.currentState,
      action: `Redo ${nextItem.action.replace('Undo ', '')}`,
      timestamp: Date.now()
    });
    this.currentState = nextItem.state; // 直接使用未来状态
    return this.currentState;
  }

  getHistory(): HistoryItem<T>[] {
    return this.history;
  }

  getFuture(): HistoryItem<T>[] {
    return this.future;
  }

  // private getStateDiff(oldState: T, newState: T): Partial<T> {
  //   const diff: Partial<T> = {};
  //   for (const key in newState) {
  //     if (this.isValueChanged(oldState[key], newState[key])) {
  //       diff[key] = newState[key];
  //     }
  //   }
  //   return diff;
  // }

  // private isValueChanged(oldValue: any, newValue: any): boolean {
  //   return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  // }

  // private applyDiff(state: T, diff: Partial<T>): T {
  //   return { ...state, ...diff };
  // }

  // private invertDiff(diff: Partial<T>): Partial<T> {
  //   const invertedDiff: Partial<T> = {};
  //   for (const key in diff) {
  //     invertedDiff[key] = this.currentState[key];
  //   }
  //   return invertedDiff;
  // }
}
