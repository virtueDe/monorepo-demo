import { Core } from ".";
import { ZERO_NODE_VALUE } from "../constant";
import { BOUNDING } from "../constant/editor";
import { Elements, ICreatePanelProps, IPanel, IZeroNode, Rows, TextNodeType } from "../types";
import { getUUID } from "../utils";

export class Panel {
  constructor(private core: Core) {
  }
  createPanel({ x, y, w, h }: ICreatePanelProps): IPanel {

    const textNode = this.core.getTextNode

    const zeroNode = textNode.createTextNode(TextNodeType.ZeroNode, ZERO_NODE_VALUE, textNode.textAttr)
    const elements: Elements = []

    elements.push(zeroNode)

    // const rows: Rows = []

    // rows.push({
    //   children: elements,
    // })

    const panel: IPanel = {
      x: x - BOUNDING.gap,
      y: y - BOUNDING.gap,
      w,
      h,
      focus: true,
      id: getUUID(),
      bounding: BOUNDING,
      contentDrawPoint: [x, y, w - BOUNDING.gap * 2, h - BOUNDING.gap * 2],
      children: elements,
    }
    return panel
  }

  findPanel(x: number, y: number) {
    const panel = this.core.panels.find(panel => {
      const { x: panelX, y: panelY, w, h } = panel
      return x >= panelX && x <= panelX + w && y >= panelY && y <= panelY + h
    })
    return panel
  }
  blurPanel() {
    this.core.panels.forEach(panel => {
      panel.focus = false
    })
  }
}
