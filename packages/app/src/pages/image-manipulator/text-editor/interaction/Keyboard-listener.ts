export class KeyboardListener {
  private eventListeners: Map<string, (event: KeyboardEvent) => void> = new Map();

  // 添加键盘事件监听器
  addEventListener(keyCombination: string, callback: (event: KeyboardEvent) => void): void {
    const normalizedKeyCombination = this.normalizeKeyCombination(keyCombination);
    if (!this.eventListeners.has(normalizedKeyCombination)) {
      document.addEventListener('keydown', (event) => {
        if (this.isKeyPressed(event, normalizedKeyCombination)) {
          callback(event);
        }
      });
      this.eventListeners.set(normalizedKeyCombination, callback);
    }
  }

  // 移除键盘事件监听器
  removeEventListener(keyCombination: string): void {
    const normalizedKeyCombination = this.normalizeKeyCombination(keyCombination);
    if (this.eventListeners.has(normalizedKeyCombination)) {
      document.removeEventListener('keydown', this.eventListeners.get(normalizedKeyCombination)!);
      this.eventListeners.delete(normalizedKeyCombination);
    }
  }

  // 检查给定的事件是否符合指定的按键组合
  private isKeyPressed(event: KeyboardEvent, keyCombination: string): boolean {
    const [mainKey, ...modifiers] = keyCombination.split('+');
    let isMainKeyMatched = false;
    let areModifiersMatched = true;

    switch (mainKey.toLowerCase()) {
      case 'enter':
        isMainKeyMatched = event.key === 'Enter';
        break;
      case 'escape':
        isMainKeyMatched = event.key === 'Escape';
        break;
      default:
        isMainKeyMatched = event.key.toLowerCase() === mainKey.toLowerCase();
    }

    for (const modifier of modifiers) {
      switch (modifier.toLowerCase()) {
        case 'ctrl':
          areModifiersMatched = areModifiersMatched && event.ctrlKey;
          break;
        case 'alt':
          areModifiersMatched = areModifiersMatched && event.altKey;
          break;
        case 'shift':
          areModifiersMatched = areModifiersMatched && event.shiftKey;
          break;
        case 'meta': // Meta 对应 Mac 上的 Command 键
          areModifiersMatched = areModifiersMatched && event.metaKey;
          break;
      }
    }

    return isMainKeyMatched && areModifiersMatched;
  }

  // 规范化按键组合字符串，统一处理 Cmd 和 Ctrl 的差异
  private normalizeKeyCombination(keyCombination: string): string {
    return keyCombination.replace('cmd', 'meta').toLowerCase();
  }
}

// // 使用示例
// const keyboardListener = new KeyboardListener();
// keyboardListener.addEventListener('ctrl+enter', (event) => {
//   console.log('Ctrl + Enter pressed');
// });

// keyboardListener.addEventListener('cmd+escape', (event) => {
//   console.log('Cmd + Escape pressed');
// });
