


// 定义所有可能的元素类型
export enum ElementType {
  SpaceNode = 'spaceNode',
  BreakNode = 'breakNode',
  ZERONode = 'zeroNode',

  TextNode = 'textNode',
}

// 定义 IElement 接口，支持不同类型元素的描述
export interface IElement {
  type: ElementType;
  id: string
  // 根据元素类型添加额外的属性
  // [key: string]: any; // 这里可以更具体地定义每个类型所需的属性
}

// 文本节点基类
export interface ITextNode extends IElement {
  type: ElementType.SpaceNode | ElementType.BreakNode | ElementType.TextNode | ElementType.ZERONode;
  value: string;
}

// 空格节点
export interface ISpaceNode extends ITextNode {
  type: ElementType.SpaceNode;
}

// 换行节点
export interface IBreakNode extends ITextNode {
  type: ElementType.BreakNode;
}

// 换行节点
export interface IZeroNode extends ITextNode {
  type: ElementType.ZERONode;
}

// 元素数组类型
export type Elements = (ISpaceNode | IBreakNode | ITextNode | IZeroNode)[];
