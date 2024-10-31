import { CanvasImageManipulator } from "..";

export class Scene {
  sceneCanvasEl!: HTMLCanvasElement;
  sceneCtx!: CanvasRenderingContext2D;

  x: number = 0
  y: number = 0
  w: number = 0
  h: number = 0

  // imageElement: HTMLImageElement = document.createElement('img');
  // margin: number = 20;
  // width: number = 0
  // height: number = 0
  // x: number = 0
  // y: number = 0
  // angle: number = 0;
  // flip = { x: 1, y: 1 }
  // sx: number = 0;
  // sy: number = 0;
  // sw: number = 0;
  // sh: number = 0;

  constructor(private rootCanvas: CanvasImageManipulator) {
    this.createScene()
  }
  createScene() {
    this.sceneCanvasEl = document.createElement('canvas');
    this.sceneCtx = this.sceneCanvasEl.getContext('2d')!;

    // 设置canvas背景为黑色
    this.sceneCtx.fillStyle = 'black';
  }
  draw() {

  }
}
