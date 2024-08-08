import { CropRect, Image, MouseInCropModule } from './graphs/index'
import { getCropReferenceLine, getCropDot, getCropLine, checkInPath } from './utils';


export enum CanvasModel {
  Preview = 'Preview',
  Crop = 'crop',
  Draw = 'draw',
  Text = 'Text',
}

export class CanvasImageManipulator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpi: number = 1;
  canvasModel: CanvasModel = CanvasModel.Preview

  viewportWidth: number = 0;
  viewportHeight: number = 0;

  private canvasScale = {
    min: 0.1,
    max: 10,
    value: 1,
    base: 1,
  }


  mouse = {
    lastX: 0,
    lastY: 0,
    cursor: 'default',
    dragging: false,
  }



  image: Image;
  cropRect: CropRect

  ro: ResizeObserver

  // /**
  //   * @description: 当前的坐标点
  //   */
  // private originX: number = 0;
  // private originY: number = 0;


  // private sourceX: number = 0;
  // private sourceY: number = 0;
  // private sourceWidth: number = 0;
  // private sourceHeight: number = 0;

  // private canvasOriginalWidth: number = 0;
  // private canvasOriginalHeight: number = 0;


  // private isEndCrop: boolean = false;


  // private flip: 'normal' | 'horizontal' | 'vertical' = 'normal'

  // /**
  //   * @description: 缩放后的宽度高度
  //   */
  // private scaleWidth: number = 0;
  // private scaleHeight: number = 0;


  // private lineX = 0
  // private lineY = 0
  // private lineWidth = 5
  // private pathData = [{ "x": 377, "y": 107 }, { "x": 377, "y": 111 }, { "x": 377, "y": 111 }, { "x": 377, "y": 115 }, { "x": 377, "y": 115 }, { "x": 377, "y": 119 }, { "x": 377, "y": 119 }, { "x": 375, "y": 126 }, { "x": 375, "y": 126 }, { "x": 374, "y": 134 }, { "x": 374, "y": 134 }, { "x": 374, "y": 142 }, { "x": 374, "y": 142 }, { "x": 373, "y": 148 }, { "x": 373, "y": 148 }, { "x": 372, "y": 158 }, { "x": 372, "y": 158 }, { "x": 370, "y": 170 }, { "x": 370, "y": 170 }, { "x": 367, "y": 183 }, { "x": 367, "y": 183 }, { "x": 366, "y": 195 }, { "x": 366, "y": 195 }, { "x": 364, "y": 207 }, { "x": 364, "y": 207 }, { "x": 362, "y": 221 }, { "x": 362, "y": 221 }, { "x": 358, "y": 239 }, { "x": 358, "y": 239 }, { "x": 356, "y": 254 }, { "x": 356, "y": 254 }, { "x": 355, "y": 266 }, { "x": 355, "y": 266 }, { "x": 353, "y": 278 }, { "x": 353, "y": 278 }, { "x": 352, "y": 285 }, { "x": 352, "y": 285 }, { "x": 350, "y": 291 }, { "x": 350, "y": 291 }, { "x": 350, "y": 297 }, { "x": 350, "y": 297 }, { "x": 350, "y": 302 }, { "x": 350, "y": 302 }, { "x": 350, "y": 306 }, { "x": 350, "y": 306 }, { "x": 350, "y": 310 }, { "x": 350, "y": 310 }, { "x": 350, "y": 312 }, { "x": 350, "y": 312 }, { "x": 349, "y": 315 }, { "x": 349, "y": 315 }, { "x": 348, "y": 316 }, { "x": 348, "y": 316 }, { "x": 348, "y": 318 }, { "x": 348, "y": 318 }, { "x": 348, "y": 319 }, { "x": 348, "y": 319 }, { "x": 348, "y": 319 }, { "x": 348, "y": 319 }, { "x": 348, "y": 321 }, { "x": 348, "y": 321 }, { "x": 348, "y": 322 }, { "x": 348, "y": 322 }, { "x": 348, "y": 323 }, { "x": 348, "y": 323 }, { "x": 348, "y": 325 }, { "x": 348, "y": 325 }, { "x": 348, "y": 327 }, { "x": 348, "y": 327 }, { "x": 348, "y": 327 }, { "x": 348, "y": 327 }, { "x": 348, "y": 328 }, { "x": 348, "y": 328 }, { "x": 348, "y": 329 }, { "x": 348, "y": 329 }, { "x": 348, "y": 331 }, { "x": 348, "y": 331 }, { "x": 348, "y": 334 }, { "x": 348, "y": 334 }, { "x": 348, "y": 337 }, { "x": 348, "y": 337 }, { "x": 348, "y": 339 }, { "x": 348, "y": 339 }, { "x": 348, "y": 344 }, { "x": 348, "y": 344 }, { "x": 347, "y": 345 }, { "x": 347, "y": 345 }, { "x": 347, "y": 347 }, { "x": 347, "y": 347 }, { "x": 347, "y": 347 }, { "x": 347, "y": 347 }, { "x": 347, "y": 348 }, { "x": 347, "y": 348 }, { "x": 346, "y": 351 }, { "x": 346, "y": 351 }, { "x": 346, "y": 351 }, { "x": 346, "y": 351 }, { "x": 346, "y": 353 }, { "x": 346, "y": 353 }, { "x": 345, "y": 355 }, { "x": 345, "y": 355 }, { "x": 344, "y": 356 }, { "x": 344, "y": 356 }, { "x": 344, "y": 357 }, { "x": 344, "y": 357 }, { "x": 344, "y": 358 }, { "x": 344, "y": 358 }, { "x": 344, "y": 359 }, { "x": 344, "y": 359 }, { "x": 344, "y": 359 }, { "x": 344, "y": 359 }, { "x": 343, "y": 361 }, { "x": 343, "y": 361 }, { "x": 343, "y": 362 }, { "x": 343, "y": 362 }, { "x": 343, "y": 363 }, { "x": 343, "y": 363 }, { "x": 343, "y": 363 }, { "x": 343, "y": 363 }, { "x": 343, "y": 365 }, { "x": 343, "y": 365 }, { "x": 343, "y": 366 }, { "x": 343, "y": 366 }, { "x": 342, "y": 367 }, { "x": 342, "y": 367 }, { "x": 342, "y": 367 }, { "x": 342, "y": 367 }, { "x": 342, "y": 368 }, { "x": 342, "y": 368 }, { "x": 342, "y": 369 }, { "x": 342, "y": 369 }, { "x": 342, "y": 370 }, { "x": 342, "y": 370 }, { "x": 342, "y": 371 }, { "x": 342, "y": 371 }, { "x": 342, "y": 372 }, { "x": 342, "y": 372 }, { "x": 342, "y": 373 }, { "x": 342, "y": 373 }, { "x": 342, "y": 375 }, { "x": 342, "y": 375 }, { "x": 341, "y": 377 }, { "x": 341, "y": 377 }, { "x": 341, "y": 378 }, { "x": 341, "y": 378 }, { "x": 341, "y": 379 }, { "x": 341, "y": 379 }, { "x": 340, "y": 379 }, { "x": 340, "y": 379 }, { "x": 340, "y": 381 }, { "x": 340, "y": 381 }, { "x": 340, "y": 382 }, { "x": 340, "y": 382 }, { "x": 338, "y": 383 }, { "x": 338, "y": 383 }, { "x": 338, "y": 384 }, { "x": 338, "y": 384 }, { "x": 338, "y": 386 }, { "x": 338, "y": 386 }, { "x": 338, "y": 387 }, { "x": 338, "y": 387 }, { "x": 338, "y": 389 }, { "x": 338, "y": 389 }, { "x": 338, "y": 390 }, { "x": 338, "y": 390 }, { "x": 338, "y": 391 }, { "x": 338, "y": 391 }, { "x": 338, "y": 392 }, { "x": 338, "y": 392 }, { "x": 338, "y": 394 }, { "x": 338, "y": 394 }, { "x": 337, "y": 395 }, { "x": 337, "y": 395 }, { "x": 337, "y": 395 }, { "x": 337, "y": 395 }, { "x": 337, "y": 396 }, { "x": 337, "y": 396 }, { "x": 337, "y": 398 }, { "x": 337, "y": 398 }, { "x": 337, "y": 399 }, { "x": 337, "y": 399 }, { "x": 337, "y": 399 }, { "x": 337, "y": 399 }, { "x": 335, "y": 401 }, { "x": 335, "y": 401 }, { "x": 335, "y": 402 }, { "x": 335, "y": 402 }, { "x": 335, "y": 403 }, { "x": 335, "y": 403 }, { "x": 335, "y": 404 }, { "x": 335, "y": 404 }, { "x": 334, "y": 404 }, { "x": 334, "y": 404 }, { "x": 334, "y": 407 }, { "x": 334, "y": 407 }, { "x": 334, "y": 410 }, { "x": 334, "y": 410 }, { "x": 334, "y": 411 }, { "x": 334, "y": 411 }, { "x": 334, "y": 413 }, { "x": 334, "y": 413 }, { "x": 334, "y": 415 }, { "x": 334, "y": 415 }, { "x": 333, "y": 417 }, { "x": 333, "y": 417 }, { "x": 332, "y": 418 }, { "x": 332, "y": 418 }, { "x": 331, "y": 420 }, { "x": 331, "y": 420 }, { "x": 331, "y": 422 }, { "x": 331, "y": 422 }, { "x": 330, "y": 424 }, { "x": 330, "y": 424 }, { "x": 330, "y": 426 }, { "x": 330, "y": 426 }, { "x": 329, "y": 429 }, { "x": 329, "y": 429 }, { "x": 328, "y": 431 }, { "x": 328, "y": 431 }, { "x": 328, "y": 432 }, { "x": 328, "y": 432 }, { "x": 328, "y": 434 }, { "x": 328, "y": 434 }, { "x": 327, "y": 435 }, { "x": 327, "y": 435 }, { "x": 327, "y": 436 }, { "x": 327, "y": 436 }, { "x": 326, "y": 438 }, { "x": 326, "y": 438 }, { "x": 326, "y": 439 }, { "x": 326, "y": 439 }, { "x": 325, "y": 440 }, { "x": 325, "y": 440 }, { "x": 325, "y": 441 }, { "x": 325, "y": 441 }, { "x": 325, "y": 442 }, { "x": 325, "y": 442 }, { "x": 324, "y": 443 }, { "x": 324, "y": 443 }, { "x": 324, "y": 443 }, { "x": 324, "y": 443 }, { "x": 324, "y": 444 }, { "x": 324, "y": 444 }, { "x": 324, "y": 445 }, { "x": 324, "y": 445 }, { "x": 324, "y": 446 }]

  // private pathData: { x: number, y: number }[] = []


  // private textAttribute = {
  //   fontSize: 50,
  //   data: 'hello Canvas',
  //   fontFamily: 'sans-serif',
  //   // font: '16px sans-serif',
  //   fillStyle: 'blue',
  //   textAlign: 'center',
  //   X: 150,
  //   y: 150
  // }


  // private cropping: boolean = false;
  // private isResizing: boolean = false;
  // private resizeEdge: string | null = null;

  // 绘制线条
  // private isDrawLine = false


  constructor(canvasId: string) {
    this.dpi = window.devicePixelRatio || 1;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    const parentWidth = this.canvas.parentElement!.offsetWidth;
    const parentHeight = this.canvas.parentElement!.offsetHeight;

    this.canvas.width = parentWidth * this.dpi;
    this.canvas.height = parentHeight * this.dpi;

    this.canvas.style.width = parentWidth + 'px';
    this.canvas.style.height = parentHeight + 'px';

    this.viewportWidth = parentWidth
    this.viewportHeight = parentHeight

    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(this.dpi, this.dpi)

    this.image = new Image();
    this.cropRect = new CropRect()

    this.ro = new ResizeObserver(entries => {
      entries.forEach(entry => {
        this.handleViewportResize(entry.contentRect.width, entry.contentRect.height)
      });
    });

    this.initEventListeners();

    // this.ro.observe(this.canvas.parentElement as HTMLElement);
  }
  public loadImage(src: string) {
    if (!src) return
    this.image.imageElement.src = src;
    this.image.imageElement.crossOrigin = 'anonymous'

    this.image.imageElement.onload = () => {
      this.onResetImage()
      this.draw()
    };
  }
  public reversal(flipType: 'normal' | 'horizontal' | 'vertical' = 'horizontal') {
    // this.flip = flipType
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // this.ctx.save();
    // this.ctx.scale(-1, 1);
    // this.originX = -this.canvas.width + this.originX;
    // this.draw()
    // this.ctx.restore()
  }
  public saveImage() {

    // var img = new Image()
    // img.crossOrigin = "anonymous";
    // img.src = this.image.src

    // img.onload = () => {
    //   const canvas = document.createElement('canvas');
    //   const width = this.sourceWidth;
    //   const height = this.sourceHeight;
    //   canvas.width = width;
    //   canvas.height = height;

    //   const ctx = canvas.getContext('2d');
    //   ctx?.drawImage(this.image, this.sourceX, this.sourceY, width, height, 0, 0, width, height);
    //   const imageName = 'cropped-image.png';
    //   canvas.toBlob((blob) => {
    //     if (blob) {
    //       // const editedFile = new File([blob], imageName, { type: blob.type });
    //       const objectUrl = URL.createObjectURL(blob);
    //       const linkElement = document.createElement('a');
    //       linkElement.download = `${imageName}`;
    //       linkElement.href = objectUrl;
    //       linkElement.click();
    //       URL.revokeObjectURL(objectUrl);
    //     }
    //   }, 'image/png');
    // }
  }
  public drawLine() {
    // this.dragging = false
    // this.isDrawLine = true
  }
  public changeLuminance(value: number) {
    // const data = this.ctx.getImageData(this.originX * this.dpi, this.originY * this.dpi, this.scaleWidth * this.dpi, this.scaleHeight * this.dpi)

    // const luminance = (imgData: ImageData, value: number) => {
    //   const data = imgData.data
    //   for (let i = 0; i < data.length; i += 4) {
    //     const hsv = this.rgb2hsv([data[i], data[i + 1], data[i + 2]])
    //     hsv[2] *= (1 + value)
    //     const rgb = this.hsv2rgb([...hsv])
    //     data[i] = rgb[0];
    //     data[i + 1] = rgb[1];
    //     data[i + 2] = rgb[2];
    //   }
    //   return imgData
    // }
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.putImageData(luminance(data, -0.5), this.originX * this.dpi, this.originY * this.dpi, 0, 0, this.scaleWidth * this.dpi, this.scaleHeight * this.dpi)
  }

  private hsv2rgb(hsv: number[]) {
    let _l = hsv[0];
    let _m = hsv[1];
    let _n = hsv[2];
    let newR = 0;
    let newG = 0;
    let newB = 0;
    if (_m === 0) {
      _l = _m = _n = Math.round(255 * _n / 100);
      newR = _l;
      newG = _m;
      newB = _n;
    } else {
      _m = _m / 100;
      _n = _n / 100;
      let p = Math.floor(_l / 60) % 6;
      let f = _l / 60 - p;
      let a = _n * (1 - _m);
      let b = _n * (1 - _m * f);
      let c = _n * (1 - _m * (1 - f));
      switch (p) {
        case 0:
          newR = _n; newG = c; newB = a;
          break;
        case 1:
          newR = b; newG = _n; newB = a;
          break;
        case 2:
          newR = a; newG = _n; newB = c;
          break;
        case 3:
          newR = a; newG = b; newB = _n;
          break;
        case 4:
          newR = c; newG = a; newB = _n;
          break;
        case 5:
          newR = _n; newG = a; newB = b;
          break;
      }
      newR = Math.round(255 * newR);
      newG = Math.round(255 * newG);
      newB = Math.round(255 * newB);
    }
    return [newR, newG, newB]
  }
  private rgb2hsv(arr: number[]) {
    let rr;
    let gg;
    let bb;
    let r = arr[0] / 255;
    let g = arr[1] / 255;
    let b = arr[2] / 255;
    let h = 0;
    let s = 0;
    let v = Math.max(r, g, b);
    let diff = v - Math.min(r, g, b);
    let diffc = function (c: number) {
      return (v - c) / 6 / diff + 1 / 2;
    };

    if (diff === 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rr = diffc(r);
      gg = diffc(g);
      bb = diffc(b);

      if (r === v) {
        h = bb - gg;
      } else if (g === v) {
        h = (1 / 3) + rr - bb;
      } else if (b === v) {
        h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
  }
  rotation(deg: number) {
    this.image.angle = deg
    this.draw()
  }
  flip(x: number, y: number) {
    this.image.flip.x = x
    this.image.flip.y = y
    this.draw()
  }
  crop() {
    this.image.sx += (this.cropRect.x - this.image.x) / this.canvasScale.value
    this.image.sy += (this.cropRect.y - this.image.y) / this.canvasScale.value
    this.image.sw = this.cropRect.width / this.canvasScale.value
    this.image.sh = this.cropRect.height / this.canvasScale.value

    this.image.x = this.cropRect.x
    this.image.y = this.cropRect.y
    this.image.width = this.cropRect.width
    this.image.height = this.cropRect.height
    this.draw()
  }
  private onResetImage() {
    const canvasAspect = this.viewportWidth / this.viewportHeight;
    const imageAspect = this.image.imageElement.width / this.image.imageElement.height;

    if (imageAspect > canvasAspect) {
      this.canvasScale.value = (this.viewportWidth - 2 * this.image.margin) / this.image.imageElement.width;
    } else {
      this.canvasScale.value = (this.viewportHeight - 2 * this.image.margin) / this.image.imageElement.height;
    }


    // 计算初始位置，使得图片居中
    this.image.x = (this.viewportWidth - this.image.imageElement.width * this.canvasScale.value) / 2;
    this.image.y = (this.viewportHeight - this.image.imageElement.height * this.canvasScale.value) / 2;

    // 计算新的宽度和高度
    this.image.width = this.image.imageElement.width * this.canvasScale.value;
    this.image.height = this.image.imageElement.height * this.canvasScale.value;

    this.image.sx = 0
    this.image.sy = 0
    this.image.sw = this.image.imageElement.width
    this.image.sh = this.image.imageElement.height
  }

  private initEventListeners() {
    this.canvas.addEventListener('mouseleave', (e) => {
      this.mouse.dragging = false;
    });
    document.addEventListener('mouseup', (e) => {
      if (!this.canvas.contains(e.target as Node)) {
        this.mouse.dragging = false;
      }
    });

    this.canvas.addEventListener('mousedown', this.handleMousedown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMousemove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseup.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));


    // 最后记得停止观察
    // ro.disconnect();

    // window.addEventListener('resize', () => {
    //   const newWidth = this.canvas.parentElement!.clientWidth;
    //   const newHeight = this.canvas.parentElement!.clientHeight

    //   const ratio = newWidth / this.canvasOriginalWidth

    //   this.originX *= ratio
    //   this.originY *= ratio
    //   this.scaleWidth *= ratio
    //   this.scaleHeight *= ratio

    //   this.textAttribute.X *= ratio
    //   this.textAttribute.y *= ratio
    //   this.textAttribute.fontSize *= ratio

    //   this.cutX *= ratio
    //   this.cutY *= ratio
    //   this.cutWidth *= ratio
    //   this.cutHeight *= ratio

    //   for (let index = 0; index < this.pathData.length; index++) {
    //     const point = this.pathData[index];
    //     point.x *= ratio
    //     point.y *= ratio
    //   }

    //   this.canvasOriginalWidth = newWidth;
    //   this.canvasOriginalHeight = newHeight;

    //   this.canvas.width = newWidth * this.dpi
    //   this.canvas.height = newHeight * this.dpi

    //   this.draw()

    // });
  }
  handleViewportResize(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;

    this.canvas.width = width * this.dpi
    this.canvas.height = height * this.dpi

    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'

    this.draw()
  }

  private handleMousedown(event: MouseEvent) {
    if (event.buttons !== 1) return;
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    // this.isDrawLine = true
    // if (this.isDrawLine) {
    //   [this.lineX, this.lineY] = [event.offsetX, event.offsetY]
    //   return
    // }
    this.mouse.dragging = true;
    this.mouse.lastX = mouseX;
    this.mouse.lastY = mouseY;

    // const edge = this.getEdge(event.offsetX, event.offsetY)

    // if (edge) {
    //   this.mouseInCropModule = 'edge'
    //   this.resizeEdge = edge;
    // }

    // if (this.isInCropBox(event.offsetX, event.offsetY)) {
    //   this.mouseInCropModule = 'crop'
    // }

    // if (this.resizeEdge) {
    //   this.isResizing = true;
    // }

    if (this.canvasModel === CanvasModel.Crop) {
      if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, [this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height], this.ctx)) {
        this.cropRect.InCropModule = MouseInCropModule.InCrop
      } else {
        this.cropRect.InCropModule = MouseInCropModule.InOut
      }

      const listCursor: {
        [key: number]: MouseInCropModule
      } = {
        0: MouseInCropModule.InTop,
        1: MouseInCropModule.InBottom,
        2: MouseInCropModule.InLeft,
        3: MouseInCropModule.InRight
      }
      this.cropRect.lineDataList.forEach((item, index) => {
        if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, item, this.ctx)) {
          this.cropRect.InCropModule = listCursor[index]
        }
      })


      const dotCursor: {
        [key: number]: MouseInCropModule
      } = {
        0: MouseInCropModule.InTop,
        1: MouseInCropModule.InBottom,
        2: MouseInCropModule.InLeft,
        3: MouseInCropModule.InRight,
        4: MouseInCropModule.InLeftTop,
        5: MouseInCropModule.InRightTop,
        6: MouseInCropModule.InLeftBottom,
        7: MouseInCropModule.InRightBottom,
      }
      this.cropRect.dotDataList.forEach((item, index) => {
        if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, item, this.ctx)) {
          this.cropRect.InCropModule = dotCursor[index]
        }
      })
    }

    // console.log(this.cropRect.InCropModule);
  }
  private handleMousemove(event: MouseEvent) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;



    // if (this.isDrawLine) {
    //   // hsl 色相(0 - 360) 饱和度 明度
    //   this.ctx.strokeStyle = `hsl(100, 90%, 50%)`;
    //   this.ctx.lineWidth = 5;
    //   this.ctx.lineCap = 'round';
    //   this.ctx.lineJoin = 'round';

    //   this.ctx.beginPath();

    //   // 控制绘制路径
    //   this.ctx.moveTo(this.lineX, this.lineY);
    //   this.pathData.push({
    //     x: this.lineX,
    //     y: this.lineY
    //   })
    //   this.ctx.lineTo(mouseX, mouseY);
    //   this.pathData.push({
    //     x: mouseX,
    //     y: mouseY
    //   });
    //   [this.lineX, this.lineY] = [mouseX, mouseY];
    //   this.ctx.stroke();

    //   return
    // }

    if (this.mouse.dragging) {
      const dx = mouseX - this.mouse.lastX;
      const dy = mouseY - this.mouse.lastY;

      this.mouse.lastX = mouseX;
      this.mouse.lastY = mouseY;
      if (this.canvasModel === CanvasModel.Crop) {
        switch (this.cropRect.InCropModule) {
          case MouseInCropModule.InTop:
            this.cropRect.y += dy
            this.cropRect.height -= dy
            break;
          case MouseInCropModule.InBottom:
            this.cropRect.height += dy
            break;
          case MouseInCropModule.InLeft:
            this.cropRect.x += dx
            this.cropRect.width -= dx
            break;
          case MouseInCropModule.InRight:
            this.cropRect.width += dx
            break;
          case MouseInCropModule.InLeftTop:
            this.cropRect.x += dx
            this.cropRect.y += dy
            this.cropRect.width -= dx
            this.cropRect.height -= dy
            break;
          case MouseInCropModule.InRightTop:
            this.cropRect.y += dy
            this.cropRect.width += dx
            this.cropRect.height -= dy
            break;
          case MouseInCropModule.InLeftBottom:
            this.cropRect.x += dx
            this.cropRect.width -= dx
            this.cropRect.height += dy
            break;
          case MouseInCropModule.InRightBottom:
            this.cropRect.width += dx
            this.cropRect.height += dy
            break;
          case MouseInCropModule.InCrop:
            // case MouseInCropModule.InOut:
            this.cropRect.x += dx
            this.cropRect.y += dy
            break;
          default:
            break;
        }

        // 限制裁剪框的位置和大小不能超出图片范围
        this.cropRect.x = Math.min(Math.max(this.image.x, this.cropRect.x), this.image.x + this.image.width - this.cropRect.width);
        this.cropRect.y = Math.min(Math.max(this.image.y, this.cropRect.y), this.image.y + this.image.height - this.cropRect.height);

        this.cropRect.width = Math.min(Math.max(50, this.cropRect.width), this.image.width);
        this.cropRect.height = Math.min(Math.max(50, this.cropRect.height), this.image.height);
      } else {
        this.image.x += dx;
        this.image.y += dy;
      }


      this.draw()
    } else {
      let cursor = 'default'
      if (this.canvasModel === CanvasModel.Crop) {
        if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, [this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height], this.ctx)) {
          cursor = 'move' || cursor
        }

        /**
         * lineCursor
         */
        const listCursor: {
          [key: number]: string
        } = {
          0: 'ns-resize',
          1: 'ns-resize',
          2: 'ew-resize',
          3: 'ew-resize'
        }
        this.cropRect.lineDataList.forEach((item, index) => {
          if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, item, this.ctx)) {
            cursor = listCursor[index] || cursor
          }
        })
        /**
         * dotCursor
         */
        const dotCursor: {
          [key: number]: string
        } = {
          0: 'ns-resize',
          1: 'ns-resize',
          2: 'ew-resize',
          3: 'ew-resize',
          4: 'nwse-resize',
          5: 'nesw-resize',
          6: 'nesw-resize',
          7: 'nwse-resize',
        }
        this.cropRect.dotDataList.forEach((item, index) => {
          if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, item, this.ctx)) {
            cursor = dotCursor[index] || cursor
          }
        })
      }

      this.canvas.style.cursor = cursor;
    }
  }
  private handleWheel(event: WheelEvent) {
    event.preventDefault();

    let centreX = event.offsetX;
    let centreY = event.offsetY;



    const wheel = event.deltaY < 0 ? 1 : -1;

    const zoom = Math.exp(wheel * 0.1);

    const newScale = this.canvasScale.value * zoom;

    if (newScale < this.canvasScale.min || newScale > this.canvasScale.max) return;

    if (this.canvasModel === CanvasModel.Crop) {
      centreX = this.image.x + this.image.width / 2
      centreY = this.image.y + this.image.height / 2


      this.cropRect.x = (this.cropRect.x - centreX) * zoom + centreX
      this.cropRect.y = (this.cropRect.y - centreY) * zoom + centreY

      this.cropRect.width *= zoom;
      this.cropRect.height *= zoom;
    }

    // 计算按照鼠标点进行缩放计算
    this.image.x = (this.image.x - centreX) * zoom + centreX;
    this.image.y = (this.image.y - centreY) * zoom + centreY;

    this.canvasScale.value = newScale;

    // // 计算新的宽度和高度
    this.image.width *= zoom;
    this.image.height *= zoom;

    // this.cutWidth = this.cutWidth * zoom;
    // this.cutHeight = this.cutHeight * zoom;

    // this.lineWidth *= zoom


    // for (let index = 0; index < this.pathData.length; index++) {
    //   const point = this.pathData[index];
    //   const newX = (point.x - mouseX) * zoom + mouseX;
    //   const newY = (point.y - mouseY) * zoom + mouseY;
    //   point.x = newX
    //   point.y = newY
    // }

    // this.textAttribute.X = (this.textAttribute.X - mouseX) * zoom + mouseX
    // this.textAttribute.y = (this.textAttribute.y - mouseY) * zoom + mouseY
    // this.textAttribute.fontSize = this.textAttribute.fontSize * zoom

    this.draw()
  }
  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMousedown);
    this.canvas.removeEventListener("mousemove", this.handleMousemove);
    this.canvas.removeEventListener("mouseup", this.handleMouseup);
    this.canvas.removeEventListener("wheel", this.handleWheel);
    this.ro.disconnect();
  }
  private handleMouseup() {
    this.mouse.dragging = false;
    // this.isDrawLine = false
    // console.log(JSON.stringify(this.pathData));

    // this.lastX = 0;
    // this.lastY = 0;
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.canvasModel === CanvasModel.Crop) {
      this.drawCropCover()
      this.drawCropRect()
    }

    // if (!this.isEndCrop) {
    //   this.sourceWidth = this.image.width;
    //   this.sourceHeight = this.image.height;
    //   this.sourceX = 0;
    //   this.sourceY = 0;
    // }

    this.drawImage()


    // // this.ctx.restore()
    // this.ctx.strokeStyle = `hsl(100, 90%, 50%)`;
    // this.ctx.lineWidth = this.lineWidth;
    // this.ctx.lineCap = 'round';
    // this.ctx.lineJoin = 'round';
    // this.ctx.beginPath();
    // for (let index = 0; index < this.pathData.length; index++) {
    //   const point = this.pathData[index];
    //   if (index === 0) {
    //     this.ctx.moveTo(point.x, point.y);
    //   } else {
    //     this.ctx.lineTo(point.x, point.y);
    //   }
    // }
    // this.ctx.stroke();

    // // 绘制文本
    // this.ctx.font = `${this.textAttribute.fontSize}px ${this.textAttribute.fontFamily}`;
    // this.ctx.textAlign = this.textAttribute.textAlign as CanvasTextAlign;
    // this.ctx.fillStyle = this.textAttribute.fillStyle;
    // this.ctx.fillText('Hello Canvas', this.textAttribute.X, this.textAttribute.y);
  }


  // // 缩放中心点，这里以画布中心为例
  // const centerX = canvas.width / 2;
  // const centerY = canvas.height / 2;

  // // 缩放点
  // const scaledPoints = points.map(point => {
  //     const newX = (point.x - centerX) * zoomLevel + centerX;
  //     const newY = (point.y - centerY) * zoomLevel + centerY;
  //     return { x: newX, y: newY };
  // });

  private drawImage() {
    this.ctx.save()
    this.ctx.globalCompositeOperation = "destination-over"
    // 中心点
    this.ctx.translate(this.image.x + this.image.width / 2, this.image.y + this.image.height / 2);
    // 翻转
    this.ctx.scale(this.image.flip.x, this.image.flip.y);
    // 旋转
    this.ctx.rotate(this.image.angle * Math.PI / 180);
    // 渲染
    this.ctx.drawImage(this.image.imageElement, this.image.sx, this.image.sy, this.image.sw, this.image.sh, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
    this.ctx.restore()
  }

  private drawCropRect() {
    this.ctx.save()

    // 绘制裁剪框
    this.ctx.strokeStyle = 'rgba(255,255,255)'
    this.ctx.lineWidth = this.cropRect.lineWidth
    this.ctx.strokeRect(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height)

    this.cropRect.lineDataList = getCropLine(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height, this.cropRect.lineWidth)

    // 绘制参考线
    this.ctx.lineWidth = this.cropRect.referenceLineWidth
    this.ctx.strokeStyle = this.cropRect.referenceLinColor
    const referenceLineList = getCropReferenceLine(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height)
    referenceLineList.forEach((item) => {
      this.ctx.beginPath()
      this.ctx.moveTo(item[0], item[1])
      this.ctx.lineTo(item[2], item[3])
      this.ctx.closePath()
      this.ctx.stroke()
    })

    // 绘制操作点
    this.ctx.fillStyle = this.cropRect.dotColor;
    this.cropRect.dotDataList = getCropDot(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height, this.cropRect.dotSize)
    this.cropRect.dotDataList.forEach((item) => {
      this.ctx.fillRect(item[0], item[1], item[2], item[3])
    })

    this.ctx.restore()
  }
  private drawCropCover() {
    this.ctx.save()
    this.ctx.fillStyle = "rgba(0,0,0,0.8)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.globalCompositeOperation = "source-atop"
    this.ctx.clearRect(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height);
    this.ctx.restore()
  }
  switchCanvasModel(value: CanvasModel) {
    this.canvasModel = value
    switch (this.canvasModel) {
      case CanvasModel.Crop:
        this.initCrop()
        break
      case CanvasModel.Draw:
        break
      default:
        break
    }
    this.draw()
  }
  public initCrop() {
    this.cropRect.width = this.image.width + this.cropRect.lineWidth
    this.cropRect.height = this.image.height + this.cropRect.lineWidth
    this.cropRect.x = this.image.x - this.cropRect.lineWidth / 2
    this.cropRect.y = this.image.y - this.cropRect.lineWidth / 2
  }
}

