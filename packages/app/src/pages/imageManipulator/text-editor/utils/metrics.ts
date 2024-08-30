import { INodeMetrics, ITextAttr } from "../types"

export const getMetrics = (text: string, attr: ITextAttr): INodeMetrics => {
  /** ctx.textBaseline 默认值是 alphabetic */

  const {
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
  } = attr;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
  const textMetrics = ctx.measureText('测试文本');
  /**
  *
  * actualBoundingBoxAscent 从文本基线到顶线的距离
  * actualBoundingBoxDescent 从文本基线到底线的距离
  *
  * actualBoundingBoxLeft  从水平对齐方式的对齐点到行框最左边的距离
  * actualBoundingBoxRight  从水平对齐方式的对齐点到行框最右边的距离
  *
  * fontBoundingBoxAscent  从文本基线到行框顶部的距离
  * fontBoundingBoxDescent 从文本基线到行框底部的距离
  *
  * alphabeticBaseline  从文本基线到 alphabetic 基线的距离
  * hangingBaseline  从文本基线到 hanging 基线的距离
  * ideographicBaseline  从文本基线到 ideographic  基线的距离
  *
  * 实际宽度 width: textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft
  * 实际高度 height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent
  * 字体文字样式下的行高度: textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;
  */


  return {
    width: textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft,
    height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent,

    actualBoundingBoxAscent: textMetrics.actualBoundingBoxAscent,
    actualBoundingBoxDescent: textMetrics.actualBoundingBoxDescent,

    fontBoundingBoxAscent: textMetrics.fontBoundingBoxAscent,
    fontBoundingBoxDescent: textMetrics.fontBoundingBoxDescent,
  }
}
