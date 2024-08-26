import { CanvasImageManipulator } from "../editor";
import { Cursor } from "./cursor";
// text 参考https://juejin.cn/post/7245922875181826108?searchId=20240824150138545A46D5FF471576A092#heading-10



const TEXT_BOX_PADDING = 20
export class TextController {
  input!: HTMLInputElement;
  cursor!: Cursor

  isCompositing: boolean = false
  x: number = 0
  y: number = 0
  width: number = 300
  height: number = 200

  drawText = {
    x: 0,
    y: 0
  }

  isActive: boolean = false;
  constructor(private edit: CanvasImageManipulator) {
    this.createdInput()

    this.cursor = new Cursor(this.edit.container)
  }
  private createdInput() {
    this.input = document.createElement('input');
    const styles = {
      padding: '0',
      position: 'fixed',
      zIndex: '-20',
    } as const;
    Object.assign(this.input.style, styles);
    this.edit.container.appendChild(this.input);
    this.input.addEventListener('input', this.onInput.bind(this));
    this.input.addEventListener('compositionstart', () => {
      this.isCompositing = true
    })
    this.input.addEventListener('compositionend', () => {
      this.isCompositing = false
    })

  }
  drawTextBox(box: { x: number, y: number, w: number, h: number }) {
    this.edit.ctx.strokeStyle = 'rgba(255,255,255)'
    this.edit.ctx.lineWidth = 2

    this.edit.ctx.strokeRect(box.x, box.y, box.w, box.h);
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
        this.edit.text.textData[this.edit.text.textData.length - 1].textProps.push({
          attribute: this.edit.text.textAttribute,
          x: this.drawText.x,
          y: this.drawText.y + this.edit.text.textAttribute.fontSize,
          data: e,
        })
        this.drawText.x += this.edit.text.textAttribute.fontSize

        this.setCursor(this.drawText.x, this.y, this.edit.text.textAttribute.fontSize * 1.2)
      })

      this.edit.draw()
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
    this.isActive = true


    this.drawText.x = x
    this.drawText.y = y

    const textDataItem = {
      boxData: {
        x: this.x - TEXT_BOX_PADDING,
        y: this.y - TEXT_BOX_PADDING,
        w: this.width,
        h: this.height,
      },
      textProps: []
    }

    this.edit.text.textData.push(textDataItem)

    this.input.value = ''

    this.focusInput()
    this.setCursor(this.x, this.y, this.edit.text.textAttribute.fontSize * 1.2)

    Object.assign(this.input.style, {
      top: y + 'px',
      left: x + 'px',
    });

    this.edit.draw()
  }

  setCursor(x: number, y: number, height: number) {
    this.cursor.showCursor(x, y, height)
  }
}
