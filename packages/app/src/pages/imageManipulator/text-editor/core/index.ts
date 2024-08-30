import { TextEditor } from "../editor";
import { ICreatePanelProps, IPanel, PanelS, ITextNode, Elements, ElementType, TextNodeType } from "../types";
import { getUUID } from "../utils";
import { Panel } from "./panel";
import { TextNode } from "./textNode";

export class Core {
  ctx!: CanvasRenderingContext2D;


  panels: PanelS = []

  private panel!: Panel
  private textNode!: TextNode


  constructor(private textEditor: TextEditor) {
    this.ctx = this.textEditor.getRootCanvas.ctx
    this.panel = new Panel(this)
    this.textNode = new TextNode(this, this.textEditor.getOptions().textAttr)
  }
  get interaction() {
    return this.textEditor.getInteraction
  }
  get getPanel() {
    return this.panel
  }
  get getTextNode() {
    return this.textNode
  }
  public createPanel({ x, y, w, h }: ICreatePanelProps): IPanel {
    const panel = this.panel.createPanel({ x, y, w, h })
    return panel
  }
  public draw() {

    this.panels.forEach(panel => {
      const { focus, bounding, x, y, w, h, children, contentDrawPoint } = panel

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
      this.drawElements(children, contentDrawPoint)
    })
  }
  drawElements(elements: Elements, drawPoint: number[]) {
    // https://blog.csdn.net/qq_31851435/article/details/132478478
    const [x, y, w, h] = drawPoint
    let index = 0;
    while (index < elements.length) {
      const element = elements[index]

      if (element.type === TextNodeType.BreakNode
        || element.type === TextNodeType.SpaceNode
        || element.type === TextNodeType.ZeroNode
        || element.type === TextNodeType.TextNode
      ) {
        // this.drawTextNode(element, { x, y, w, h })
      }

      // const flag = [TextNodeType.BreakNode, TextNodeType.SpaceNode, TextNodeType.TextNode, TextNodeType.ZeroNode].includes(element.type)


      // if (element.type === ElementType.ImageNode) {

      // }
      // switch (element.type) {
      // case TextNodeType.BreakNode:
      //   // if (element instanceof ITextNode) {
      //   //   ctx.fillText(element.value, element.metrics.width, element.metrics.height);
      //   // }
      //   break;
      // case ElementType.ImageNode:
      //   if (element instanceof IImageNode) {
      //     ctx.drawImage(element.src, element.metrics.width, element.metrics.height);
      //   }
      //   break;
      // case ElementType.FormulaNode:
      //   if (element instanceof IFormulaNode) {
      //     // 假设有一个渲染公式的函数
      //     renderFormula(element.formula, ctx, element.metrics);
      //   }
      //   break;
      // case ElementType.OtherNode:
      //   if (element instanceof IOtherNode) {
      //     // 处理其他类型的节点
      //     renderOther(element.content, ctx, element.metrics);
      //   }
      //   break;
      // case TextNodeType.SpaceNode:
      //   if (element instanceof ISpaceNode) {
      //     // 处理空格节点
      //     ctx.fillText(' ', element.metrics.width, element.metrics.height);
      //   }
      //   break;
      // case TextNodeType.BreakNode:
      //   if (element instanceof IBreakNode) {
      //     // 处理换行节点
      //     ctx.fillText('\n', element.metrics.width, element.metrics.height);
      //   }
      //   break;
      // case TextNodeType.ZeroNode:
      //   if (element instanceof IZeroNode) {
      //     // 处理零宽占位符节点
      //     ctx.fillText('\u200B', element.metrics.width, element.metrics.height);
      //   }
      //   break;
      //   default:
      // }
    }
  }
  // private drawTextNode(elements: Elements, drawPoint: number[]) {
  //   // const [x, y, w, h] = drawPoint
  //   // let index = 0
  //   // console.log(elements, x, y, w, h);
  //   // while (index) {

  //   // }
  // }
  onInput(text: string) {
    // 1. 生成基本node节点
    // 2. 插入到当前panel光标所在的行中
    // console.log(123, text);
    // const textNodeData: ITextNode = {
    //   type: ElementType.TextNode,
    //   value: text,
    //   id: getUUID(),
    // }
  }
}
