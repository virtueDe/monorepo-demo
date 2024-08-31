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
}
