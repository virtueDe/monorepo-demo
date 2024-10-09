

export interface LineItem {
  drawType: DrawType
  strokeStyle: string
  lineWidth: number
  data: { x: number, y: number }[]
}

export interface LineOptions {

}

export enum DrawType {
  Line = 'line',
  Eraser = 'eraser'
}

export class Line {

  lineData: LineItem[] = []
  cursor: string = 'crosshair';
  drawType: DrawType = DrawType.Line;
  strokeStyle: string = 'red';
  lineWidth: number = 12
  lineStartX: number = 0;
  lineStartY: number = 0;
  constructor() { }
}
