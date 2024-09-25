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
    // const _panel: any = [{ "x": 218, "y": 176, "w": 200, "h": 200, "focus": true, "id": "editor-0487-9e50-c95a", "bounding": { "borderWidth": 2, "borderColor": "#ffffff", "gap": 20 }, "contentDrawPoint": [238, 196, 160, 160], "children": [{ "rowIndex": 0, "type": "zeroNode", "value": "​", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-567f-27d1-7196", "metrics": { "width": 0, "height": 30, "actualBoundingBoxAscent": 0, "actualBoundingBoxDescent": 0, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 238, "y": 196, "w": 0, "h": 30 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-7702-672a-e3c9", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 24, "actualBoundingBoxDescent": 5, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 238, "y": 196, "w": 30, "h": 29 } }, { "rowIndex": 0, "type": "textNode", "value": "实", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-a062-4cbe-7f07", "metrics": { "width": 30, "height": 30, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 5, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 268, "y": 196, "w": 30, "h": 30 } }, { "rowIndex": 0, "type": "textNode", "value": "打", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-6dfe-bbfc-d847", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 298, "y": 196, "w": 30, "h": 29 } }, { "rowIndex": 0, "type": "textNode", "value": "实", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-ec38-fccc-717b", "metrics": { "width": 30, "height": 30, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 5, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 328, "y": 196, "w": 30, "h": 30 } }, { "rowIndex": 0, "type": "textNode", "value": "的", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-f757-b35d-0ef6", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 358, "y": 196, "w": 30, "h": 29 } }, { "rowIndex": 1, "type": "textNode", "value": "打", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-eb14-4c4a-eeb1", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 238, "y": 236, "w": 30, "h": 29 } }, { "rowIndex": 1, "type": "textNode", "value": "算", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-031b-25ab-29dd", "metrics": { "width": 30, "height": 30, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 5, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 268, "y": 236, "w": 30, "h": 30 } }, { "rowIndex": 1, "type": "textNode", "value": "撒", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-41ca-f728-eea1", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 298, "y": 236, "w": 30, "h": 29 } }, { "rowIndex": 1, "type": "textNode", "value": "打", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-a286-3d5e-ba8b", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 328, "y": 236, "w": 30, "h": 29 } }, { "rowIndex": 1, "type": "textNode", "value": "算", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-07d2-ea3e-866d", "metrics": { "width": 30, "height": 30, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 5, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 358, "y": 236, "w": 30, "h": 30 } }, { "rowIndex": 1, "type": "textNode", "value": " ", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-3347-c8ab-d902", "metrics": { "width": 8.876953125, "height": 0, "actualBoundingBoxAscent": 0, "actualBoundingBoxDescent": 0, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 388, "y": 236, "w": 8.876953125, "h": 0 } }, { "rowIndex": 2, "type": "textNode", "value": "阿", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-7abe-e9b4-20d4", "metrics": { "width": 30, "height": 27, "actualBoundingBoxAscent": 23, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 238, "y": 275, "w": 30, "h": 27 } }, { "rowIndex": 2, "type": "textNode", "value": "萨", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-820f-76f5-c51e", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 268, "y": 275, "w": 30, "h": 29 } }, { "rowIndex": 2, "type": "textNode", "value": "撒", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-243b-47b4-a022", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 298, "y": 275, "w": 30, "h": 29 } }, { "rowIndex": 2, "type": "textNode", "value": "撒", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-fa7f-05fe-9e04", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 328, "y": 275, "w": 30, "h": 29 } }, { "rowIndex": 2, "type": "textNode", "value": "撒", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-be1d-5e12-9fad", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 25, "actualBoundingBoxDescent": 4, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 358, "y": 275, "w": 30, "h": 29 } }, { "rowIndex": 0, "type": "textNode", "value": "啊", "attr": { "fontFamily": "sans-serif", "fontSize": 30, "fontColor": "#ff0000", "fontWeight": "normal", "fontStyle": "normal", "fontUnderline": "normal", "fontLineThrough": "normal" }, "id": "editor-32ad-a965-794c", "metrics": { "width": 30, "height": 29, "actualBoundingBoxAscent": 24, "actualBoundingBoxDescent": 5, "fontBoundingBoxAscent": 32, "fontBoundingBoxDescent": 8 }, "position": { "x": 0, "y": 0, "w": 0, "h": 0 } }] }]
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
    console.time('textDraw')
    // console.log('draw', JSON.stringify(this.panels))
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

        // // 绘制区域
        // this.interaction.ctx.strokeStyle = 'blue'
        // this.interaction.ctx.lineWidth = 2
        // this.interaction.ctx.strokeRect(contentDrawPoint[0], contentDrawPoint[1], contentDrawPoint[2], contentDrawPoint[3]);
      }

      this.computeRowDrawPoint(panel)

      this.drawElements(panel)
    })
    console.timeEnd('textDraw')
  }
  computeRowDrawPoint(panel: IPanel) {
    const rows: IRow[] = []
    const { contentDrawPoint: drawRange, children: elements, id } = panel
    let [drawRangeX, drawRangeY, drawRangeW, drawRangeH] = drawRange
    /** 当前行的剩余渲染宽度 */
    let residualWidth = drawRangeW
    /** 是否重新计算Y轴 */
    let againComputeY = true
    /** 当前渲染在第几行 */
    let rowIndex = 0;

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
          }
        } = element

        if (residualWidth < width || element.type === TextNodeType.SpaceNode) {
          againComputeY = true
        }
        if (againComputeY) {
          againComputeY = false
          residualWidth = drawRangeW
          if (rowIndex != 0) {
            y += rows[rowIndex - 1].h
          }
          const rowItem = {
            x: drawRangeX,
            y,
            h: rowIndex === 0 ? height + LINE_GAP * 2 : actualBoundingBoxAscent + actualBoundingBoxDescent + LINE_GAP * 2,
            w: width,
            baseline: actualBoundingBoxAscent,
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

    // console.log(this.rowDrawBaselineMap);
    console.log(elements);
  }
  drawElements(panel: IPanel) {
    const { contentDrawPoint: drawRange, children, id } = panel
    const rows = this.rowDrawBaselineMap.get(id) as unknown as IRow[]
    let [drawRangeX, drawRangeY, drawRangeW, drawRangeH] = drawRange

    let index = 0;
    /** 当前行的剩余渲染宽度 */
    let residualWidth = drawRangeW
    /** 是否重新计算Y轴 */
    let againComputeY = true
    /** 当前渲染在第几行 */
    let rowIndex = 0
    /** 文字渲染的X, Y */
    let drawY = drawRangeY
    /** 文字渲染的X, Y */
    let drawX = drawRangeX

    // this.ctx.save()
    // rows.forEach((row, index) => {
    //   this.ctx.fillStyle = index % 2 === 0 ? 'red' : 'blue';
    //   this.ctx.globalAlpha = 0.6; // 设置透明度
    //   this.ctx.fillRect(row.x, row.y, row.w, row.h);
    // })
    // this.ctx.restore()


    while (index < children.length) {
      const element = children[index]
      element.index = index

      if (element.type === TextNodeType.BreakNode
        || element.type === TextNodeType.SpaceNode
        || element.type === TextNodeType.ZeroNode
        || element.type === TextNodeType.TextNode
      ) {

        let { value,
          attr: { fontFamily, fontSize, fontColor, fontWeight, fontStyle, fontUnderline, fontLineThrough },
          metrics: {
            width,
            height,
            // actualBoundingBoxAscent,
            // actualBoundingBoxDescent,
            // fontBoundingBoxAscent,
            // fontBoundingBoxDescent
          },
          position,
        } = element

        if (residualWidth < width || element.type === TextNodeType.SpaceNode) {
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

        // 设置当前元素的一些属性
        position.x = drawX
        // position.y = drawY - rows[element.rowIndex].ascent - LINE_GAP
        position.y = rows[element.rowIndex].y
        position.w = width
        position.h = height

        this.ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(value, drawX, drawY);

        // // 绘制基线
        // this.ctx.lineWidth = 1;
        // this.ctx.strokeStyle = 'blue';
        // this.ctx.beginPath();
        // this.ctx.moveTo(drawX, drawY);
        // this.ctx.lineTo(drawX + width, drawY);
        // this.ctx.stroke();

        drawX += width
        residualWidth -= width
      } else { }
      index++
    }
  }
  private drawTextNode(elements: Elements, drawPoint: number[]) {
  }
  /**
   * @param text
   */
  onInput(text: string) {

    const textNodeList = text.split('').map(char => {
      const textNode = this.textNode.createTextNode(TextNodeType.TextNode, char, this.textNode.textAttr)
      return textNode
    })
    this.focusPanel?.children.splice(this.interaction.cursor.cursorIndex + 1, 0, ...textNodeList)
    this.textEditor.getRootCanvas.draw()
    this.interaction.cursor.updateCursorPosition(this.interaction.cursor.cursorIndex + textNodeList.length)
  }
  insertNode(Elements: Elements) {
  }
  deleteNode() {
  }
}
