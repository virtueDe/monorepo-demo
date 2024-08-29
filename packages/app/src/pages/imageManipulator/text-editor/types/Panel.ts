import { IPointBase, IBounding, Rows } from "."

export interface IPanel extends IPointBase {
  id: string
  // 包围框
  bounding: IBounding
  // 文字元素
  children: Rows
  // 是否聚焦
  focus: boolean
  // 文字绘制点
  contentDrawPoint: number[]
}

export type PanelS = IPanel[]
