export class Image {
  imageElement: HTMLImageElement = document.createElement('img');
  margin: number = 20;
  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 0
  angle: number = 0;
  flip = { x: 1, y: 1 }
  sx: number = 0;
  sy: number = 0;
  sw: number = 0;
  sh: number = 0;
  constructor() { }
}
