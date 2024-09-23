import { IPointBase, IBounding, Elements } from "."

export interface IPanel extends IPointBase {
  id: string
  // 包围框
  bounding: IBounding
  // 是否聚焦
  focus: boolean
  // 文字绘制点
  contentDrawPoint: number[]
  // 文字元素
  children: Elements
}

export type PanelS = IPanel[]
