
export enum MouseInCropModule {
  InCrop = 'inCrop',
  InOut = 'inOut',

  InTop = 'inTop',
  InBottom = 'inBottom',
  InLeft = 'inLeft',
  InRight = 'inRight',

  InLeftTop = 'inLeftTop',
  InRightBottom = 'inRightBottom',
  InLeftBottom = 'inLeftBottom',
  InRightTop = 'inRightTop',
}


export class CropRect {
  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 0

  lineWidth: number = 6
  lineColor: string = 'rgba(255,255,255)'
  lineDataList: number[][] = []

  referenceLineWidth: number = 3;
  referenceLinColor: string = 'rgba(255,255,255,.2)'

  dotSize: number = 20;
  dotColor: string = 'rgba(255,255,255)'
  dotDataList: number[][] = []

  InCropModule: MouseInCropModule = MouseInCropModule.InOut
  constructor() { }
}
