import { Interaction } from ".";
import { LINE_GAP } from "../constant";
import { IElement } from "../types";
export class Cursor {
  cursorEl!: HTMLElement;
  private containerEl!: HTMLElement;
  cursorTimer!: any;
  // 光标所在元素索引
  cursorIndex: number = 0;
  // 光标所在元素
  cursorInElement!: IElement | undefined;
  constructor(private interaction: Interaction) {
    this.cursorEl = document.createElement('div')
    const style = {
      display: 'none',
      position: 'absolute',
      width: '1px',
      top: '0px',
      left: '0px',
      backgroundColor: '#fff',
    } as const;
    Object.assign(this.cursorEl.style, style)
    this.containerEl = this.interaction.getTextEditor().getRootCanvas.container
    this.containerEl.appendChild(this.cursorEl)
  }
  drawCursor(x: number, y: number, height: number) {
    const style = {
      left: `${x}px`,
      top: `${y}px`,
      height: `${height}px`,
      display: 'block',
    }
    Object.assign(this.cursorEl.style, style)
    // this.blinkCursor('0')
  }
  // 光标闪烁
  // blinkCursor(opacity: string) {
  //   clearTimeout(this.cursorTimer)
  //   this.cursorTimer = setTimeout(() => {
  //     this.cursorEl.style.opacity = opacity
  //     this.blinkCursor(opacity === '0' ? '1' : '0')
  //   }, 600)
  // }
  hideCursor() {
    // clearTimeout(this.cursorTimer)
    this.cursorEl.style.display = 'none'
  }

  getPointElement(x: number, y: number): { element: IElement | null, index: number } {

    // TODO: 光标这里还要优化，光标在行的前面后面
    let pointElement: IElement | null = null
    let pointIndex: number = -1


    const panel = this.interaction.getTextEditor().getCore().focusPanel
    if (!panel) {
      return { element: pointElement, index: pointIndex }
    }

    const { children: elements = [] } = panel

    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      const { position } = element;

      if (
        x >= position.x &&
        x <= position.x + position.w &&
        y >= position.y &&
        y <= position.y + position.h
      ) {
        // 计算 x 坐标是否超过元素的一半
        const halfWidth = position.w / 2;
        if (x <= position.x + halfWidth) {
          pointElement = elements[index - 1] || null;
          pointIndex = pointElement ? pointElement.index : 0
        } else {
          pointElement = element;
          pointIndex = pointElement.index;
        }
        break;
      }
    }
    if (!pointElement) {
      pointElement = elements[elements.length - 1]
      pointIndex = pointElement.index;
    }

    return { element: pointElement, index: pointIndex }
  }
  computeCursorPosition(x: number, y: number) {
    const { element, index } = this.getPointElement(x, y)
    if (!element) {
      return
    }
    this.cursorInElement = element
    this.cursorIndex = index
    this.drawCursor(this.cursorInElement.position.x + this.cursorInElement.position.w, this.cursorInElement.position.y + LINE_GAP, this.cursorInElement.position.h * 1.2)
  }
  updateCursorPosition(index?: number) {
    const panel = this.interaction.getTextEditor().getCore().focusPanel
    if (!panel) {
      return
    }
    const { children: elements = [] } = panel
    if (index === undefined) {
      this.cursorInElement = elements[elements.length - 1]
      this.cursorIndex = this.cursorInElement.index
    } else {
      this.cursorIndex = index
      this.cursorInElement = elements[this.cursorIndex]
    }
    this.drawCursor(this.cursorInElement.position.x + this.cursorInElement.position.w, this.cursorInElement.position.y + LINE_GAP, this.cursorInElement.position.h * 1.2)
  }
}
