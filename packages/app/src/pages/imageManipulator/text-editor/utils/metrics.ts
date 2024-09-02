import { FontStyle, INodeMetrics, ITextAttr } from "../types"

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
  const textMetrics = ctx.measureText(text);
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
  let width = textMetrics.width
  // TODO: 斜体的宽度还需要重新计算
  if (fontStyle === FontStyle.Italic) {
    width = textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft
    // width = textMetrics.width + 2
  }
  return {
    width,
    height: textMetrics.actualBoundingBoxAscent || 0 + textMetrics.actualBoundingBoxDescent || 0,

    actualBoundingBoxAscent: textMetrics.actualBoundingBoxAscent || 0,
    actualBoundingBoxDescent: textMetrics.actualBoundingBoxDescent || 0,

    fontBoundingBoxAscent: textMetrics.fontBoundingBoxAscent || 0,
    fontBoundingBoxDescent: textMetrics.fontBoundingBoxDescent || 0,
  }
}
