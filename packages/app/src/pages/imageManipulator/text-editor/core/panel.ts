import { Core } from ".";
import { ZERO_NODE_VALUE } from "../constant";
import { BOUNDING } from "../constant/Editor";
import { Elements, ElementType, ICreatePanelProps, IPanel, IZeroNode, Rows } from "../types";
import { getUUID } from "../utils";

export class Panel {
  constructor(private core: Core) {
  }
  createPanel({ x, y, w, h }: ICreatePanelProps): IPanel {

    const textNode: IZeroNode = {
      type: ElementType.ZERONode,
      value: ZERO_NODE_VALUE,
      id: getUUID(),
    }

    const elements: Elements = []

    elements.push(textNode)

    const rows: Rows = []

    rows.push({
      children: elements,
    })
    // const enterNode: INodeRuntime = {
    //   type: LINEFEED_NODE,
    //   nodes: [],
    //   data: {
    //     docId: baseNode.data.docId,
    //     pid: baseNode.data.pid,
    //     prole: baseNode.data.prole,
    //     pname: baseNode.data.pname,
    //     id: getUUID(),
    //     value: ZERO,
    //     index: -1,
    //     marks: deepclone(baseNode.data.marks),
    //     metrics: this.interactionEngine.getCore().getRenderEngine().getBreakPageComputer().getNodeMetrics(ZERO, baseNode.data.marks),
    //     position: getNodeDefaultPosition(),
    //     role: isInControl ? CONTENT : '',
    //     ...controlData,
    //   },
    // };

    const panel: IPanel = {
      x: x - BOUNDING.gap,
      y: y - BOUNDING.gap,
      w,
      h,
      focus: true,
      id: getUUID(),
      bounding: BOUNDING,
      contentDrawPoint: [x, y, w - BOUNDING.gap * 2, h - BOUNDING.gap * 2],
      children: rows,
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
