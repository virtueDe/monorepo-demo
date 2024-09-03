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
    const panel = this.core.getPanel.findPanel(x, y)
    if (panel) {
      panel.focus = true
    } else {
      const newPanel = this.core.createPanel({ x, y, w: PANEL_WIDTH, h: PANEL_HEIGHT })
      this.core.panels.push(newPanel)
    }
    this.rootCanvas.draw()

    this.interaction.setCursorPosition(x, y)
    this.interaction.input.focus()
  }
  public handleMousemove(x: number, y: number) {

  }
  public createTextEditorPanel({ x, y, w, h }: ICreatePanelProps) {
    this.core.createPanel({ x, y, w, h })
  }
  draw() {
    this.core.draw()
    // this.interaction.cursor.updateCursorPosition()
    console.log('this.core.panels', this.core.panels);
  }
}
