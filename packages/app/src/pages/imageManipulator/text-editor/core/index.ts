import { FontStyle, FontWeight } from "../../graphs";
import { UNDERLINE_GAP } from "../constant";
import { TextEditor } from "../editor";
import { ICreatePanelProps, IPanel, PanelS, Elements, TextNodeType, FontUnderline, FontLineThrough } from "../types";
import { Panel } from "./panel";
import { TextNode } from "./textNode";

interface IRow {
  // w: number;
  // h: number;
  baseline: number;
  ascent: number;
  descent: number;
  index: number
  panelId: string
}

export class Core {
  ctx!: CanvasRenderingContext2D;
  panels: PanelS = []
  private panel!: Panel
  private textNode!: TextNode

  rowDrawBaselineMap: Map<string, IRow[]> = new Map()
  constructor(private textEditor: TextEditor) {
    this.ctx = this.textEditor.getRootCanvas.ctx
    this.panel = new Panel(this)
    this.textNode = new TextNode(this, this.textEditor.getOptions().textAttr)
    const _panel: any = [{ "x": 159, "y": 117, "w": 200, "h": 200, "focus": true, "id": "editor-d6c8-d59e-4a11", "bounding": { "borderWidth": 2, "borderColor": "#ffffff", "gap": 20 }, "contentDrawPoint": [179, 137, 160, 160], "children": [{ "rowIndex": 0, "type": "zeroNode", "value": "​", "attr": { "fontFamily": "sans-serif", "fontSize": 18, "fontColor": "#ff0000", "fontWeight": "bold", "fontStyle": "italic", "fontUnderline": "underline", "fontLineThrough": "lineThrough" }, "id": "editor-4aa2-a740-7b0e", "metrics": { "width": 0, "height": 0, "actualBoundingBoxAscent": 0, "actualBoundingBoxDescent": 0, "fontBoundingBoxAscent": 19, "fontBoundingBoxDescent": 5 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 18, "fontColor": "#ff0000", "fontWeight": "bold", "fontStyle": "italic", "fontUnderline": "underline", "fontLineThrough": "lineThrough" }, "id": "editor-94da-05f8-0e08", "metrics": { "width": 18, "height": 15, "actualBoundingBoxAscent": 15, "actualBoundingBoxDescent": 3, "fontBoundingBoxAscent": 19, "fontBoundingBoxDescent": 5 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 32, "fontColor": "#ff0000", "fontWeight": "bold", "fontStyle": "italic", "fontUnderline": "underline", "fontLineThrough": "lineThrough" }, "id": "editor-4ed7-53a8-012b", "metrics": { "width": 32, "height": 26, "actualBoundingBoxAscent": 26, "actualBoundingBoxDescent": 5, "fontBoundingBoxAscent": 34, "fontBoundingBoxDescent": 8 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 42, "fontColor": "#ff0000", "fontWeight": "bold", "fontStyle": "italic", "fontUnderline": "underline", "fontLineThrough": "lineThrough" }, "id": "editor-697c-0d09-fb10", "metrics": { "width": 42, "height": 34, "actualBoundingBoxAscent": 34, "actualBoundingBoxDescent": 6, "fontBoundingBoxAscent": 44, "fontBoundingBoxDescent": 11 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 48, "fontColor": "#ff0000", "fontWeight": "bold", "fontStyle": "italic", "fontUnderline": "underline", "fontLineThrough": "lineThrough" }, "id": "editor-80e0-5563-fda5", "metrics": { "width": 48, "height": 38, "actualBoundingBoxAscent": 38, "actualBoundingBoxDescent": 7, "fontBoundingBoxAscent": 51, "fontBoundingBoxDescent": 13 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 29, "fontColor": "#ff0000", "fontWeight": "bold", "fontStyle": "italic", "fontUnderline": "underline", "fontLineThrough": "lineThrough" }, "id": "editor-9deb-7787-6105", "metrics": { "width": 29, "height": 23, "actualBoundingBoxAscent": 23, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 31, "fontBoundingBoxDescent": 8 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 20, "fontColor": "#ff0000", "fontWeight": "bold", "fontStyle": "italic", "fontUnderline": "underline", "fontLineThrough": "lineThrough" }, "id": "editor-4746-dd1b-2dd9", "metrics": { "width": 20, "height": 16, "actualBoundingBoxAscent": 16, "actualBoundingBoxDescent": 3, "fontBoundingBoxAscent": 21, "fontBoundingBoxDescent": 5 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 32, "fontColor": "#ff0000", "fontWeight": "bold", "fontStyle": "italic", "fontUnderline": "underline", "fontLineThrough": "lineThrough" }, "id": "editor-a309-b703-0c4a", "metrics": { "width": 32, "height": 26, "actualBoundingBoxAscent": 26, "actualBoundingBoxDescent": 5, "fontBoundingBoxAscent": 34, "fontBoundingBoxDescent": 8 } }] }]
    this.panels = _panel
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
    console.time('draw')
    console.log('draw', JSON.stringify(this.panels))
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

        // 绘制区域
        this.interaction.ctx.strokeStyle = 'blue'
        this.interaction.ctx.lineWidth = 2
        this.interaction.ctx.strokeRect(contentDrawPoint[0], contentDrawPoint[1], contentDrawPoint[2], contentDrawPoint[3]);
      }

      this.computeRowDrawPoint(panel)

      this.drawElements(panel)
    })
    console.timeEnd('draw')
  }
  computeRowDrawPoint(panel: IPanel) {
    const rows: IRow[] = []
    const { contentDrawPoint: drawRange, children: elements, id } = panel
    let [drawRangeX, drawRangeY, drawRangeW, drawRangeH] = drawRange
    // 当前行的剩余渲染宽度
    let residualWidth = drawRangeW
    // 是否重新计算Y轴
    let againComputeY = true
    let rowIndex = 0;
    let rowWidth = 0;


    let elementIndex = 0;
    while (elementIndex < elements.length) {

      const element = elements[elementIndex]
      if (element.type === TextNodeType.BreakNode
        || element.type === TextNodeType.SpaceNode
        || element.type === TextNodeType.ZeroNode
        || element.type === TextNodeType.TextNode
      ) {
        // debugger
        const {
          // attr: { fontFamily, fontSize, fontColor, fontWeight, fontStyle, fontUnderline, fontLineThrough },
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
        }
        if (againComputeY) {
          rowWidth = 0;

          againComputeY = false
          residualWidth = drawRangeW

          const rowItem = {
            // w: rowWidth,
            // h: (fontBoundingBoxAscent + fontBoundingBoxDescent),
            baseline: (actualBoundingBoxAscent),
            index: rowIndex,
            panelId: id,
            ascent: actualBoundingBoxAscent,
            descent: actualBoundingBoxDescent,
          }
          rows.push(rowItem)
          element.rowIndex = rowIndex
          rowIndex++
        } else {
          const curRow = rows[rows.length - 1]
          if (curRow.baseline < (actualBoundingBoxAscent)) {
            curRow.baseline = (actualBoundingBoxAscent)
            curRow.ascent = actualBoundingBoxAscent
            curRow.descent = actualBoundingBoxDescent
          }
          element.rowIndex = curRow.index
          // curRow.w += width
        }

        residualWidth -= width
      } else { }
      elementIndex++
    }

    this.rowDrawBaselineMap.set(id, rows)

    console.log(this.rowDrawBaselineMap);
    console.log(elements);
  }
  drawElements(panel: IPanel) {
    const { contentDrawPoint: drawRange, children: elements, id } = panel
    const rows = this.rowDrawBaselineMap.get(id) as unknown as IRow[]
    let [drawRangeX, drawRangeY, drawRangeW, drawRangeH] = drawRange

    let index = 0;
    // 当前行的剩余渲染宽度
    let residualWidth = drawRangeW
    // 是否重新计算Y轴
    let againComputeY = true
    // 当前渲染在第几行
    let rowIndex = 0
    // 文字渲染的X, Y
    let drawY = drawRangeY
    let drawX = drawRangeX

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
        drawHeight = rows[element.rowIndex].baseline

        if (againComputeY) {
          if (rowIndex === 0) {
            drawY += drawHeight
          } else {
            // TODO: 这里行的的数据需要一个行高来计算
            drawY += drawHeight + rows[element.rowIndex - 1].descent + UNDERLINE_GAP
          }
          againComputeY = false
          residualWidth = drawRangeW
          rowIndex++
        }

        // 绘制下划线
        if (fontUnderline === FontUnderline.Underline) {
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = fontColor;
          this.ctx.beginPath();
          this.ctx.moveTo(drawX, drawY + rows[element.rowIndex].descent + UNDERLINE_GAP);
          this.ctx.lineTo(drawX + width, drawY + rows[element.rowIndex].descent + UNDERLINE_GAP);
          this.ctx.stroke();
        }

        // 绘制删除线
        if (fontLineThrough === FontLineThrough.LineThrough) {
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = fontColor;
          this.ctx.beginPath();
          this.ctx.moveTo(drawX, drawY - height / 3);
          this.ctx.lineTo(drawX + width, drawY - height / 3);
          this.ctx.stroke();
        }

        this.ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(value, drawX, drawY);

        // 绘制基线
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'blue';
        this.ctx.beginPath();
        this.ctx.moveTo(drawX, drawY);
        this.ctx.lineTo(drawX + width, drawY);
        this.ctx.stroke();

        drawX += width
        residualWidth -= width
      } else { }
      index++
    }
  }
  private drawTextNode(elements: Elements, drawPoint: number[]) {
  }
  /**
   * 输入事件
   *1. 生成基本node节点
   *2. 插入到当前panel光标所在的行中
   * @param text
   */
  onInput(text: string) {

    const textNodeList = text.split('').map(char => {
      const textNode = this.textNode.createTextNode(TextNodeType.TextNode, char, this.textNode.textAttr)
      return textNode
    })

    this.focusPanel?.children.push(...textNodeList)
    this.textEditor.getRootCanvas.draw()
  }
}
