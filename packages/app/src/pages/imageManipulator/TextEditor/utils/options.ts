import { ITextEditorOptions, OptionalOptions } from "../types"

export const mergeOptions = (defaultOptions: ITextEditorOptions, options: OptionalOptions): ITextEditorOptions => {
  return {
    bounding: { ...defaultOptions.bounding, ...options.bounding },
    textAttr: { ...defaultOptions.textAttr, ...options.textAttr },
  }
}
