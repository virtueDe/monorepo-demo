import { FontLineThrough, FontStyle, FontUnderline, FontWeight } from "./TextAttr";

export interface ITextAttr {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: FontWeight;
  fontStyle: FontStyle;
  fontUnderline: FontUnderline;
  fontLineThrough: FontLineThrough;
}
export interface IBounding {
  borderWidth: number;
  borderColor: string;
  gap: number;
}

export interface ITextEditorOptions {
  bounding: IBounding
  textAttr: ITextAttr
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type OptionalOptions = DeepPartial<ITextEditorOptions>;
