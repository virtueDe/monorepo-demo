import { ITextEditorOptions, IBounding, FontLineThrough, FontUnderline, FontStyle, FontWeight } from '../types'

export const PANEL_WIDTH = 200
export const PANEL_HEIGHT = 200

export const BORDER_WIDTH = 2
export const BORDER_COLOR = '#ffffff'
export const GAP = 20

export const BOUNDING: IBounding = {
  borderWidth: BORDER_WIDTH,
  borderColor: BORDER_COLOR,
  gap: GAP,
}

export const FONT_FAMILY = 'sans-serif'
export const FONT_SIZE = 16
export const FONT_COLOR = '#000'
export const FONT_WEIGHT = FontWeight.Normal
export const FONT_STYLE = FontStyle.Normal
export const FONT_UNDERLINE = FontUnderline.Normal
export const FONT_LINE_THROUGH = FontLineThrough.Normal


export const TEXT_ATTR = {
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZE,
  fontColor: FONT_COLOR,
  fontWeight: FONT_WEIGHT,
  fontStyle: FONT_STYLE,
  fontUnderline: FONT_UNDERLINE,
  fontLineThrough: FONT_LINE_THROUGH,
}

export const defaultOptions: ITextEditorOptions = {
  bounding: BOUNDING,
  textAttr: TEXT_ATTR,
}
export const ZERO_NODE_VALUE = '\u200B';
export const SPACE_NODE_VALUE = ' ';
export const BREAK_NODE_VALUE = '\n';

// 下划线距离文本底线的距离
export const UNDERLINE_GAP = 2;

export const LINE_GAP = 5;
