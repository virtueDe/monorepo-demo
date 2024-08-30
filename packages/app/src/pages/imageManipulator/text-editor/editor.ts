import { CanvasImageManipulator } from "../editor";
import { defaultOptions, PANEL_HEIGHT, PANEL_WIDTH } from "./constant";
import { Core } from "./core";
import { Interaction } from "./interaction";
import { ICreatePanelProps, ITextEditorOptions, OptionalOptions } from "./types";
import { mergeOptions } from "./utils";
// text 参考https://juejin.cn/post/7245922875181826108?searchId=20240824150138545A46D5FF471576A092#heading-10


// const TEXT_BOX_PADDING = 20
export class TextEditor {
  private options!: ITextEditorOptions
  private core!: Core
  private interaction!: Interaction

  // input!: HTMLTextAreaElement;
  // cursor!: Cursor

  // isCompositing: boolean = false
  // x: number = 0
  // y: number = 0
  // width: number = 300
  // height: number = 200

  // drawText = {
  //   x: 0,
  //   y: 0
  // }

  // isActive: boolean = false;
  constructor(private rootCanvas: CanvasImageManipulator, options?: OptionalOptions) {

    this.options = mergeOptions(defaultOptions, options || {})

    this.core = new Core(this)
    this.interaction = new Interaction(this)

    // console.log(this.rootCanvas, this.options);


    // this.createdInput()
    // this.cursor = new Cursor(this.edit.container)
  }
  get getRootCanvas() {
    return this.rootCanvas
  }
  get getInteraction() {
    return this.interaction
  }
  public getCore() {
    return this.core
  }

  public getOptions() {
    return this.options
  }

  public setOptions(options?: OptionalOptions) {
    this.options = mergeOptions(this.options, options || {})

    this.core.getTextNode.setTextAttr(this.options.textAttr)
  }
  public handleMousedown(x: number, y: number) {
    this.core.getPanel.blurPanel()
    const cursorPoint = {
      x: 0,
      y: 0,
      h: 0
    }

    const panel = this.core.getPanel.findPanel(x, y)
    if (panel) {
      panel.focus = true

      // cursorPoint.x

    } else {

      const panel = this.core.createPanel({ x, y, w: PANEL_WIDTH, h: PANEL_HEIGHT })
      this.core.panels.push(panel)
      cursorPoint.x = panel.x
      cursorPoint.y = panel.y
      // cursorPoint.y = y
    }


    // 更新光标和输入框的位置
    // 1. 如果是已经有的panel，更新鼠标位置到具体的文字后面
    // 2. 如果是新建输入的，更新鼠标位置到输入框的开头
    this.interaction.setCursorPosition(cursorPoint.x, cursorPoint.y)

    this.interaction.input.focus()

    this.rootCanvas.draw()
  }
  public createTextEditorPanel({ x, y, w, h }: ICreatePanelProps) {
    this.core.createPanel({ x, y, w, h })
  }
  draw() {
    this.core.draw()
    console.log('this.core.panels', this.core.panels);
  }
  // private createdInput() {
  //   this.input = document.createElement('textarea');
  //   const styles = {
  //     padding: '0',
  //     position: 'fixed',
  //     zIndex: '-20',
  //   } as const;
  //   Object.assign(this.input.style, styles);
  //   this.edit.container.appendChild(this.input);
  //   this.input.addEventListener('input', this.onInput.bind(this));
  //   this.input.addEventListener('compositionstart', () => {
  //     this.isCompositing = true
  //   })
  //   this.input.addEventListener('compositionend', () => {
  //     this.isCompositing = false
  //   })

  // }
  // drawTextBox(box: { x: number, y: number, w: number, h: number }) {
  //   this.edit.ctx.strokeStyle = 'rgba(255,255,255)'
  //   this.edit.ctx.lineWidth = 2

  //   this.edit.ctx.strokeRect(box.x, box.y, box.w, box.h);
  // }

  // 输入事件
  // onInput(Event: Event) {
  //   setTimeout(() => {
  // const e = Event as InputEvent
  // let data = e.data
  // if (!data || this.isCompositing) {
  //   return
  // }
  // data.split('').forEach(e => {
  //   const {
  //     fontSize,
  //     fontFamily,
  //     fontWeight,
  //     fontStyle,
  //   } = this.edit.text.textAttribute;
  //   this.edit.ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
  //   // // 计算基线
  //   // const baselineAscent = this.edit.ctx?.zfont?.match(/\d+/)[0] * 0.7 as any; // 大致估算基线位置
  //   // const baselineDescent = this.edit.ctx.font.match(/\d+/)[0] * 0.3; // 大致估算基线位置
  //   const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = this.edit.ctx.measureText(e);
  //   const h = actualBoundingBoxAscent + actualBoundingBoxDescent
  //   this.edit.text.textData[this.edit.text.textData.length - 1].textProps.push({
  //     attribute: this.edit.text.textAttribute,
  //     ascent: actualBoundingBoxAscent,
  //     descent: actualBoundingBoxDescent,
  //     w: width,
  //     h,
  //     x: this.drawText.x,
  //     // TODO: 文字基线Y有问题计算
  //     // y: this.drawText.y + this.edit.text.textAttribute.fontSize,
  //     y: this.drawText.y,
  //     data: e,
  //   })
  //   this.drawText.x += width

  //   this.setCursor(this.drawText.x, this.y, h * 1.2)
  // })

  // this.edit.draw()
  // })
  //   }

  // private focusInput() {
  //   setTimeout(() => {
  //     this.input.focus()
  //   })
  // }
  // private blurInput() {
  //   setTimeout(() => {
  //     this.input.blur()
  //   })
  // }
  // draw(x: number, y: number) {
  // this.x = x
  // this.y = y
  // this.isActive = true


  // this.drawText.x = x
  // this.drawText.y = y

  // const textDataItem = {
  //   boxData: {
  //     x: this.x - TEXT_BOX_PADDING,
  //     y: this.y - TEXT_BOX_PADDING,
  //     w: this.width,
  //     h: this.height,
  //   },
  //   textProps: []
  // }

  // this.edit.text.textData.push(textDataItem)

  // this.input.value = ''

  // this.focusInput()

  // // TODO: 这里光标的高度有待商榷
  // this.setCursor(this.x, this.y, this.edit.text.textAttribute.fontSize * 1.2)

  // Object.assign(this.input.style, {
  //   top: y + 'px',
  //   left: x + 'px',
  // });

  // this.edit.draw()
  // }

  // setCursor(x: number, y: number, height: number) {
  //   this.cursor.showCursor(x, y, height)
  // }
}
