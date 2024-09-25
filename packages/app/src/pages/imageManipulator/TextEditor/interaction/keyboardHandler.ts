import { BREAK_NODE_VALUE, KEYBOARD_KEYS, SPACE_NODE_VALUE } from '../constant';
import { TextNodeType } from '../types';
import { Interaction } from '.';

export class KeyboardHandler {
  constructor(private interaction: Interaction) {
    this.initKeyboardListeners();
  }
  get rootCanvas() {
    return this.interaction.getTextEditor().getRootCanvas
  }
  get core() {
    return this.interaction.getTextEditor().getCore()
  }

  private initKeyboardListeners() {
    const { keyboardListener } = this.interaction;

    keyboardListener.addEventListener(KEYBOARD_KEYS.BACKSPACE, this.handleBackspace.bind(this));
    keyboardListener.addEventListener(KEYBOARD_KEYS.DELETE, this.handleDelete.bind(this));
    keyboardListener.addEventListener(KEYBOARD_KEYS.ARROW_UP, this.handleArrowUp.bind(this));
    keyboardListener.addEventListener(KEYBOARD_KEYS.ARROW_DOWN, this.handleArrowDown.bind(this));
    keyboardListener.addEventListener(KEYBOARD_KEYS.ARROW_LEFT, this.handleArrowLeft.bind(this));
    keyboardListener.addEventListener(KEYBOARD_KEYS.ARROW_RIGHT, this.handleArrowRight.bind(this));
    keyboardListener.addEventListener(KEYBOARD_KEYS.ENTER, this.handleEnter.bind(this));
  }

  private handleBackspace() {
    // 实现退格键逻辑
    const { focusPanel } = this.core
    if (focusPanel) {
      const { children } = focusPanel
      const element = children[this.interaction.cursor.cursorIndex]
      if (element.type === TextNodeType.ZeroNode) {
        return
      }
      if (!element) return
      children.splice(this.interaction.cursor.cursorIndex, 1)
      this.rootCanvas.draw()
      this.interaction.cursor.updateCursorPosition(this.interaction.cursor.cursorIndex - 1)
    }
  }

  private handleDelete() {
    // 实现删除键逻辑
    const { focusPanel } = this.core
    if (focusPanel) {
      const { children } = focusPanel
      const element = children[this.interaction.cursor.cursorIndex + 1]
      if (element.type === TextNodeType.ZeroNode) {
        return
      }
      if (!element) return
      children.splice(this.interaction.cursor.cursorIndex + 1, 1)
      this.rootCanvas.draw()
      this.interaction.cursor.updateCursorPosition(this.interaction.cursor.cursorIndex)
    }
  }

  private handleArrowUp() {
    // 实现向上箭头键逻辑
    const { focusPanel } = this.core
    if (focusPanel) {
      const { children } = focusPanel;
      const currentElement = children[this.interaction.cursor.cursorIndex];
      if (!currentElement) return;

      // 查找上一行相同水平位置的元素
      const currentRow = currentElement.rowIndex;
      const currentX = currentElement.position.x;
      let newIndex = -1;

      for (let i = this.interaction.cursor.cursorIndex - 1; i >= 0; i--) {
        if (children[i].rowIndex < currentRow) {
          if (Math.abs(children[i].position.x - currentX) < children[i].position.w / 2) {
            newIndex = i;
            break;
          }
        }
      }

      if (newIndex !== -1) {
        this.interaction.cursor.updateCursorPosition(newIndex);
      }
    }
  }

  private handleArrowDown() {
    // 实现向下箭头键逻辑
    const { focusPanel } = this.core
    if (focusPanel) {
      const { children } = focusPanel;
      const currentElement = children[this.interaction.cursor.cursorIndex];
      if (!currentElement) return;

      // 查找下一行相同水平位置的元素
      const currentRow = currentElement.rowIndex;
      const currentX = currentElement.position.x;
      let newIndex = -1;

      for (let i = this.interaction.cursor.cursorIndex + 1; i < children.length; i++) {
        if (children[i].rowIndex > currentRow) {
          if (Math.abs(children[i].position.x - currentX) < children[i].position.w / 2) {
            newIndex = i;
            break;
          }
        }
      }

      if (newIndex !== -1) {
        this.interaction.cursor.updateCursorPosition(newIndex);
      }
    }
  }

  private handleArrowLeft() {
    // 实现向左箭头键逻辑
    const { focusPanel } = this.core
    if (focusPanel) {
      const { children } = focusPanel
      const element = children[this.interaction.cursor.cursorIndex]
      if (!element) return
      if (element.type === TextNodeType.TextNode) {
        this.interaction.cursor.updateCursorPosition(this.interaction.cursor.cursorIndex - 1)
      }
    }
  }

  private handleArrowRight() {
    // 实现向右箭头键逻辑
    const { focusPanel } = this.core
    if (focusPanel) {
      const { children } = focusPanel
      const element = children[this.interaction.cursor.cursorIndex]
      if (!element) { return }
      if (children.length - 1 === this.interaction.cursor.cursorIndex) {
        return
      }
      this.interaction.cursor.updateCursorPosition(this.interaction.cursor.cursorIndex + 1)
    }
  }

  private handleEnter() {
    // 实现回车键逻辑
    const { focusPanel } = this.core
    if (focusPanel) {
      const { children } = focusPanel
      const element = children[this.interaction.cursor.cursorIndex]
      if (!element) return
      const breakNode = this.core.getTextNode.createTextNode(TextNodeType.BreakNode, BREAK_NODE_VALUE, this.core.getTextNode.textAttr)
      // console.log(breakNode);
      children.splice(this.interaction.cursor.cursorIndex + 1, 0, breakNode)
      this.rootCanvas.draw()
      this.interaction.cursor.updateCursorPosition(this.interaction.cursor.cursorIndex + 1)
    }
  }
}
