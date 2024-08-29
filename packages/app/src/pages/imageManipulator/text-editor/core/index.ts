import { TextEditor } from "../editor";
import { ICreatePanelProps, PanelS, Rows } from "../types";
import { Panel } from "./panel";
import { TextNode } from "./textNode";

export class Core {
  ctx!: CanvasRenderingContext2D;


  panels: PanelS = []

  private panel!: Panel
  private textNode!: TextNode


  constructor(private textEditor: TextEditor) {
    this.ctx = this.textEditor.getRootCanvas().ctx
    this.panel = new Panel(this)
    this.textNode = new TextNode(this)
  }
  get interaction() {
    return this.textEditor.getInteraction()
  }
  public createPanel({ x, y, w, h }: ICreatePanelProps) {
    const panel = this.panel.createPanel({ x, y, w, h })
    this.panels.push(panel)
  }
  public draw() {

    this.panels.forEach(panel => {
      const { focus, bounding, x, y, w, h, children } = panel

      if (focus) {
        const { borderColor, borderWidth } = bounding
        this.interaction.bounding.draw({
          x,
          y,
          w,
          h,
          borderColor,
          borderWidth
        })
      }
      this.drawText(children)

    })
  }
  private drawText(rows: Rows) {
    console.log(rows);
  }
  onInput(text: string) {
    console.log(123, text);
  }
}
