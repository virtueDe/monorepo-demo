import { ITextAttr } from "./ITextEditor";



export enum TextNodeType {
  SpaceNode = 'spaceNode',
  BreakNode = 'breakNode',
  ZeroNode = 'zeroNode',
  TextNode = 'textNode',
}
export enum ElementType {
  TextNode = 'TextNode',
  ImageNode = 'imageNode',
  FormulaNode = 'formulaNode',
  OtherNode = 'otherNode',
}
export interface IElement {
  type: ElementType | TextNodeType;
  id: string;
  rowIndex: number;
}

export interface INodeMetrics {
  width: number;
  height: number;
  actualBoundingBoxAscent: number;
  actualBoundingBoxDescent: number;
  fontBoundingBoxAscent: number;
  fontBoundingBoxDescent: number;
}

// 文本节点基类
export interface IBaseTextNode extends IElement {
  type: TextNodeType;
  value: string;
  metrics: INodeMetrics;
  attr: ITextAttr;
}

// 空格节点
export interface ISpaceNode extends IBaseTextNode {
  type: TextNodeType.SpaceNode;
}

// 换行节点
export interface IBreakNode extends IBaseTextNode {
  type: TextNodeType.BreakNode;
}

// 零宽占位符节点
export interface IZeroNode extends IBaseTextNode {
  type: TextNodeType.ZeroNode;
}

// 普通文本节点
export interface ITextNode extends IBaseTextNode {
  type: TextNodeType.TextNode;
}

// 图片节点
export interface IImageNode extends IElement {
  type: ElementType.ImageNode;
  src: string;
  alt: string;
  metrics: INodeMetrics;
}

// 公式节点
export interface IFormulaNode extends IElement {
  type: ElementType.FormulaNode;
  formula: string;
  metrics: INodeMetrics;
}

// 其他节点
export interface IOtherNode extends IElement {
  type: ElementType.OtherNode;
  content: any;
  metrics: INodeMetrics;
}

export type Elements =
  (| IImageNode
    | IFormulaNode
    | IOtherNode
    | ITextNode | ISpaceNode | IBreakNode | IZeroNode
  )[];
