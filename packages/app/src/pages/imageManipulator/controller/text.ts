import { CanvasImageManipulator } from "../editor";
// text 参考https://juejin.cn/post/7245922875181826108?searchId=20240824150138545A46D5FF471576A092#heading-10
export class TextController {
  input!: HTMLInputElement;
  isCompositing: boolean = false
  x: number = 0
  y: number = 0
  // isActive: boolean = false;
  constructor(private canvas: CanvasImageManipulator) {
    this.createdInput()
  }
  private createdInput() {
    this.input = document.createElement('input');
    const styles = {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      resize: 'none',
      padding: '0',
      position: 'absolute',
      overflow: 'hidden',
      width: '240px',
      top: '200px',
      left: '500px',
      zIndex: '-20',
    } as const;
    Object.assign(this.input.style, styles);
    document.body.appendChild(this.input);
    this.input.addEventListener('input', this.onInput.bind(this));
    this.input.addEventListener('compositionstart', () => {
      this.isCompositing = true
    })
    this.input.addEventListener('compositionend', () => {
      this.isCompositing = false
    })

  }
  // 输入事件
  onInput(Event: Event) {
    setTimeout(() => {
      const e = Event as InputEvent
      let data = e.data
      if (!data || this.isCompositing) {
        return
      }
      data.split('').forEach(e => {
        this.canvas.text.textData.push({
          attribute: this.canvas.text.textAttribute,
          x: this.x,
          y: this.y,
          data: e
        })
        this.x += this.canvas.text.textAttribute.fontSize
      })
      this.canvas.draw()
    })
  }

  private focusInput() {
    setTimeout(() => {
      this.input.focus()
    })
  }
  private blurInput() {
    setTimeout(() => {
      this.input.blur()
    })
  }
  draw(x: number, y: number) {
    this.x = x
    this.y = y
    this.input.value = ''
    this.focusInput()
  }
}
