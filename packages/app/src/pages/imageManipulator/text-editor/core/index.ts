import { FontStyle, FontWeight } from "../../graphs";
import { LINE_GAP, UNDERLINE_GAP } from "../constant";
import { TextEditor } from "../editor";
import { ICreatePanelProps, IPanel, PanelS, Elements, TextNodeType, FontUnderline, FontLineThrough } from "../types";
import { Panel } from "./panel";
import { TextNode } from "./textNode";

interface IRow {
  x: number
  y: number
  w: number;
  h: number;
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
    // const _panel: any = [{ "x": 114, "y": 89, "w": 200, "h": 200, "focus": true, "id": "editor-f67d-3bc1-a8fb", "bounding": { "borderWidth": 2, "borderColor": "#ffffff", "gap": 20 }, "contentDrawPoint": [134, 109, 160, 160], "children": [{ "rowIndex": 0, "type": "zeroNode", "value": "​", "attr": { "fontFamily": "sans-serif", "fontSize": 40, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-9c1e-2a65-474e", "metrics": { "width": 0, "height": 0, "actualBoundingBoxAscent": 0, "actualBoundingBoxDescent": 0, "fontBoundingBoxAscent": 42, "fontBoundingBoxDescent": 10 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 40, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-6154-6099-ed7d", "metrics": { "width": 40, "height": 31, "actualBoundingBoxAscent": 31, "actualBoundingBoxDescent": 6, "fontBoundingBoxAscent": 42, "fontBoundingBoxDescent": 10 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 40, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-ae88-7da4-9736", "metrics": { "width": 40, "height": 31, "actualBoundingBoxAscent": 31, "actualBoundingBoxDescent": 6, "fontBoundingBoxAscent": 42, "fontBoundingBoxDescent": 10 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-a165-65bf-79fc", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-f2ef-95b8-49f9", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-2dbb-2069-2494", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-3eb6-195d-c4bf", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-f629-1d6b-61ac", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-e0b0-c1a2-d1d9", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-07f3-6e1b-cb11", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-dd83-a254-fcc5", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 50, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-7b9f-cb02-64d9", "metrics": { "width": 50, "height": 39, "actualBoundingBoxAscent": 39, "actualBoundingBoxDescent": 7, "fontBoundingBoxAscent": 53, "fontBoundingBoxDescent": 13 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 50, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-f6e2-0b97-69a2", "metrics": { "width": 50, "height": 39, "actualBoundingBoxAscent": 39, "actualBoundingBoxDescent": 7, "fontBoundingBoxAscent": 53, "fontBoundingBoxDescent": 13 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-fb97-9962-d487", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-4a6f-8b35-35d8", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-c2d9-4592-3e03", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-9e49-1d05-de29", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-f95e-0728-a344", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 1, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-c50d-133e-ff32", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 2, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-35ad-5081-a67f", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 2, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-9198-1ce9-90e8", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 2, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 10, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-cabc-c58a-1477", "metrics": { "width": 10, "height": 8, "actualBoundingBoxAscent": 8, "actualBoundingBoxDescent": 1, "fontBoundingBoxAscent": 11, "fontBoundingBoxDescent": 3 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 70, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-2169-4e3c-215c", "metrics": { "width": 70, "height": 55, "actualBoundingBoxAscent": 55, "actualBoundingBoxDescent": 10, "fontBoundingBoxAscent": 74, "fontBoundingBoxDescent": 18 } }] }]
    // this.panels = _panel
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
    // TODO：这里还需要再优化，英文和数字行有问题行高
    const rows: IRow[] = []
    const { contentDrawPoint: drawRange, children: elements, id } = panel
    let [drawRangeX, drawRangeY, drawRangeW, drawRangeH] = drawRange
    // 当前行的剩余渲染宽度
    let residualWidth = drawRangeW
    // 是否重新计算Y轴
    let againComputeY = true
    let rowIndex = 0;
    let rowWidth = 0;

    let y = drawRangeY

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
          if (rowIndex != 0) {
            y += rows[rowIndex - 1].h
          }
          const rowItem = {
            x: drawRangeX,
            y,
            h: actualBoundingBoxAscent + actualBoundingBoxDescent + LINE_GAP * 2,
            w: width,
            baseline: actualBoundingBoxAscent + LINE_GAP,
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
          if (curRow.baseline < actualBoundingBoxAscent) {
            curRow.baseline = actualBoundingBoxAscent
            curRow.ascent = actualBoundingBoxAscent
            curRow.descent = actualBoundingBoxDescent
            curRow.h = actualBoundingBoxAscent + actualBoundingBoxDescent + LINE_GAP * 2
          }
          element.rowIndex = curRow.index
          curRow.w += width
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

    this.ctx.save()
    rows.forEach((row, index) => {
      this.ctx.fillStyle = index % 2 === 0 ? 'red' : 'blue';
      this.ctx.globalAlpha = 0.6; // 设置透明度
      this.ctx.fillRect(row.x, row.y, row.w, row.h);
    })
    this.ctx.restore()


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

        if (againComputeY) {
          if (rowIndex === 0) {
            drawY += rows[element.rowIndex].baseline + LINE_GAP
          } else {
            drawY += rows[element.rowIndex].baseline + rows[element.rowIndex - 1].descent + LINE_GAP * 2
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
