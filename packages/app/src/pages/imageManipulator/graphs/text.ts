// 字体加粗
export enum FontWeight {
  Bold = 'bold',
  Normal = 'normal',
}

// 斜体
export enum FontStyle {
  Italic = 'italic',
  Normal = 'normal',
}

// 下划线
export enum FontUnderline {
  Normal = 'normal',
  Underline = 'underline',
}


// 删除线
export enum FontLineThrough {
  Normal = 'normal',
  LineThrough = 'lineThrough',
}

// 上划线
export enum FontOverline {
  Normal = 'normal',
  Overline = 'overline',
}

export interface TextAttribute {
  fontFamily: string
  fontSize: number
  fontColor: string
  fontWeight: FontWeight
  fontStyle: FontStyle
  fontUnderline: FontUnderline
  fontLineThrough: FontLineThrough
  // fontOverline: FontOverline
}

interface TextProps {
  attribute: TextAttribute
  x: number
  y: number
  data: string
}

export class TextGraphs {
  cursor: string = 'text';
  textAttribute!: TextAttribute

  textData: TextProps[] = []

  constructor() {
    this.textAttribute = {
      fontFamily: 'sans-serif',
      fontSize: 14,
      fontColor: '#000',
      fontWeight: FontWeight.Normal,
      fontStyle: FontStyle.Normal,
      fontUnderline: FontUnderline.Normal,
      fontLineThrough: FontLineThrough.Normal,
    }
  }
}
