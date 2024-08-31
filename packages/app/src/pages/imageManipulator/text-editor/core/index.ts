import { FontStyle, FontWeight } from "../../graphs";
import { UNDERLINE_GAP } from "../constant";
import { TextEditor } from "../editor";
import { ICreatePanelProps, IPanel, PanelS, Elements, TextNodeType, FontUnderline, FontLineThrough } from "../types";
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
    // this.panels = [
    //   {
    //     "x": 230,
    //     "y": 254,
    //     "w": 200,
    //     "h": 200,
    //     "focus": true,
    //     "id": "editor-f44e-05aa-f094",
    //     "bounding": { "borderWidth": 2, "borderColor": "#ffffff", "gap": 20 },
    //     "contentDrawPoint": [250, 274, 160, 160],
    //     "children": [
    //       {
    //         "type": TextNodeType.ZeroNode,
    //         "value": "​",
    //         "attr":
    //         {
    //           "fontFamily": "sans-serif",
    //           "fontSize": 30,
    //           "fontColor": "#ff0000",
    //           "fontWeight": FontWeight.Normal,
    //           "fontStyle": FontStyle.Normal,
    //           "fontUnderline": FontUnderline.Normal,
    //           "fontLineThrough": FontLineThrough.Normal
    //         },
    //         "id": "editor-810c-3acf-93f1",
    //         "metrics": { "width": 0, "height": 0, "actualBoundingBoxAscent": 0, "actualBoundingBoxDescent": 0, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }
    //       },
    //       {
    //         "type": TextNodeType.TextNode,
    //         "value": "阿",
    //         "attr": {
    //           "fontFamily": "sans-serif",
    //           "fontSize": 30,
    //           "fontColor": "#ff0000",
    //           "fontWeight": FontWeight.Normal,
    //           "fontStyle": FontStyle.Normal,
    //           "fontUnderline": FontUnderline.Normal,
    //           "fontLineThrough": FontLineThrough.Normal
    //         },
    //         "id": "editor-7102-dacd-eab9", "metrics": { "width": 29, "height": 27, "actualBoundingBoxAscent": 23, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }
    //       },
    //       {
    //         "type": TextNodeType.TextNode,
    //         "value": "斯",
    //         "attr": {
    //           "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000",
    //           "fontWeight": FontWeight.Bold,
    //           "fontStyle": FontStyle.Normal,
    //           "fontUnderline": FontUnderline.Normal,
    //           "fontLineThrough": FontLineThrough.Normal
    //         },
    //         "id": "editor-7091-b0cd-7b9b",
    //         "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }
    //       },
    //       {
    //         "type": TextNodeType.TextNode,
    //         "value": "顿", "attr": {
    //           "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000",
    //           "fontWeight": FontWeight.Normal,
    //           "fontStyle": FontStyle.Normal,
    //           "fontUnderline": FontUnderline.Underline,
    //           "fontLineThrough": FontLineThrough.LineThrough
    //         },
    //         "id": "editor-5dea-cb93-2f30",
    //         "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }
    //       },
    //       {
    //         "type": TextNodeType.TextNode,
    //         "value": "阿",
    //         "attr": {
    //           "fontFamily": "sans-serif",
    //           "fontSize": 30,
    //           "fontColor": "#ff0000",
    //           "fontWeight": FontWeight.Normal,
    //           "fontStyle": FontStyle.Normal,
    //           "fontUnderline": FontUnderline.Normal,
    //           "fontLineThrough": FontLineThrough.Normal
    //         },
    //         "id": "editor-7102-dacd-eab9", "metrics": { "width": 29, "height": 27, "actualBoundingBoxAscent": 23, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }
    //       },
    //       {
    //         "type": TextNodeType.TextNode,
    //         "value": "斯",
    //         "attr": {
    //           "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000",
    //           "fontWeight": FontWeight.Normal,
    //           "fontStyle": FontStyle.Normal,
    //           "fontUnderline": FontUnderline.Normal,
    //           "fontLineThrough": FontLineThrough.Normal
    //         },
    //         "id": "editor-7091-b0cd-7b9b",
    //         "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }
    //       },
    //       {
    //         "type": TextNodeType.TextNode,
    //         "value": "顿", "attr": {
    //           "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000",
    //           "fontWeight": FontWeight.Bold,
    //           "fontStyle": FontStyle.Normal,
    //           "fontUnderline": FontUnderline.Normal,
    //           "fontLineThrough": FontLineThrough.Normal
    //         },
    //         "id": "editor-5dea-cb93-2f30",
    //         "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }
    //       },
    //       {
    //         "type": TextNodeType.TextNode,
    //         "value": "顿", "attr": {
    //           "fontFamily": "sans-serif", "fontSize": 20, "fontColor": "#ff0000",
    //           "fontWeight": FontWeight.Normal,
    //           "fontStyle": FontStyle.Normal,
    //           "fontUnderline": FontUnderline.Underline,
    //           "fontLineThrough": FontLineThrough.Normal
    //         },
    //         "id": "editor-5dea-cb93-2f30",
    //         "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }
    //       }
    //     ]
    //   }]
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

  get focusPanel() {
    return this.panels.find(panel => panel.focus)
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
  drawElements(elements: Elements, drawRange: number[]) {
    let [drawRangeX, drawRangeY, drawRangeW, drawRangeH] = drawRange

    let index = 0;
    // 当前行的剩余渲染宽度
    let residualWidth = drawRangeW
    // 是否重新计算Y轴
    let againComputeY = true
    // 当前渲染在第几行
    let rowIndex = 0
    // 文字渲染的X, Y
    let drawY = 0
    let drawX = drawRangeX
    //
    let drawHeightArr = []


    while (index < elements.length) {
      const element = elements[index]

      if (element.type === TextNodeType.BreakNode
        || element.type === TextNodeType.SpaceNode
        || element.type === TextNodeType.ZeroNode
        || element.type === TextNodeType.TextNode
      ) {

        const { value,
          attr: { fontFamily, fontSize, fontColor, fontWeight, fontStyle, fontUnderline, fontLineThrough },
          metrics: {
            width,
            height,
            actualBoundingBoxAscent,
            actualBoundingBoxDescent,
            fontBoundingBoxAscent,
            fontBoundingBoxDescent
          }
        } = element

        if (residualWidth < width) {
          againComputeY = true
          drawX = drawRangeX
        }

        let drawHeight = 0
        if (fontBoundingBoxAscent && fontBoundingBoxDescent) {
          drawHeight = (fontBoundingBoxAscent + fontBoundingBoxDescent)
          drawHeightArr.push(drawHeight)
        }

        if (againComputeY) {
          rowIndex++
          // TODO: 这里算的不对，不应该这样算
          drawY = drawRangeY + (rowIndex * Math.min(...drawHeightArr))
          againComputeY = false
          residualWidth = drawRangeW
        }

        // 绘制下划线
        if (fontUnderline === FontUnderline.Underline) {
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = fontColor;
          this.ctx.beginPath();
          this.ctx.moveTo(drawX, drawY + UNDERLINE_GAP);
          this.ctx.lineTo(drawX + width, drawY + UNDERLINE_GAP);
          this.ctx.stroke();
        }

        // 绘制删除线
        if (fontLineThrough === FontLineThrough.LineThrough) {
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = fontColor;
          this.ctx.beginPath();
          if (fontBoundingBoxAscent && fontBoundingBoxDescent) {
            this.ctx.moveTo(drawX, drawY + fontBoundingBoxDescent - drawHeight / 2);
            this.ctx.lineTo(drawX + width, drawY + fontBoundingBoxDescent - drawHeight / 2);
          }
          this.ctx.stroke();
        }


        this.ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(value, drawX, drawY);
        drawX += width
        residualWidth -= width
      } else { }
      index++
    }
  }
  // private drawTextNode(elements: Elements, drawPoint: number[]) {
  // const [x, y, w, h] = drawPoint
  // let index = 0
  // console.log(elements, x, y, w, h);
  // while (index) {

  // }
  // }
  /**
   * 输入事件
   *1. 生成基本node节点
   *2. 插入到当前panel光标所在的行中
   * @param text
   */
  onInput(text: string) {

    const textNodeList = text.split('').map(char => {
      const textNode = this.textNode.createTextNode(TextNodeType.TextNode, char, this.textNode.textAttr)
      console.log(textNode);
      // const textNodeData: ITextNode = {
      //   type: ElementType.TextNode,
      //   value: char,
      //   id: getUUID(),
      // }
      // this.textNode.createTextNode(textNodeData)
      return textNode
    })

    this.focusPanel?.children.push(...textNodeList)
    console.log(this.focusPanel, this.panels, JSON.stringify(this.panels));
    this.draw()
    // console.log(123, text);
    // const textNodeData: ITextNode = {
    //   type: ElementType.TextNode,
    //   value: text,
    //   id: getUUID(),
    // }
  }
}
