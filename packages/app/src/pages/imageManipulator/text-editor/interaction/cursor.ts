// enum CursorType {
//   Default = 'default',
//   Text = 'text',
// }
export class Cursor {
  container!: HTMLElement
  el: HTMLElement = document.createElement('div')
  cursorTimer!: any;
  // type = CursorType.Default
  constructor(container: HTMLElement) {
    this.container = container
    const style = {
      display: 'none',
      position: 'absolute',
      width: '1px',
      backgroundColor: '#fff',
    }
    Object.assign(this.el.style, style)
    this.container.appendChild(this.el)
  }
  showCursor(x: number, y: number, height: number) {
    const style = {
      left: `${x}px`,
      top: `${y}px`,
      height: `${height}px`,
      display: 'block',
    }
    Object.assign(this.el.style, style)

    this.blinkCursor('0')
  }
  // 光标闪烁
  blinkCursor(opacity: string) {
    clearTimeout(this.cursorTimer)
    this.cursorTimer = setTimeout(() => {
      this.el.style.opacity = opacity
      this.blinkCursor(opacity === '0' ? '1' : '0')
    }, 600)
  }
  hideCursor() {
    clearTimeout(this.cursorTimer)
    this.el.style.display = 'none'
  }
}
