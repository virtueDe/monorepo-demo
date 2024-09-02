import { Core } from ".";
import { ITextAttr, ITextNode, TextNodeType } from "../types";
import { getUUID, getMetrics } from "../utils";

export class TextNode {
  constructor(private core: Core, private textAttrOptions: ITextAttr) {
  }

  // TODO: 类型需要优化
  createTextNode(type: TextNodeType, value: string, attr: ITextAttr) {
    const metrics = getMetrics(value, attr)
    return {
      rowIndex: 0,
      type,
      value,
      attr,
      id: getUUID(),
      metrics
    }
  }

  get textAttr() {
    return this.textAttrOptions
  }
  setTextAttr(attr: ITextAttr) {
    this.textAttrOptions = attr
  }
}
