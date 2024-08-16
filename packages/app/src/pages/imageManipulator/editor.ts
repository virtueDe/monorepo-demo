import { CropRect, FilterType, Image, ImageStyleKey, MouseInCropModule } from './graphs/index'
import { getCropReferenceLine, getCropDot, getCropLine, checkInPath, rangeTransform, getNextPixel, getNextRowPixel, getPreviousPixel, isLastRow, isLastPixelInRow, getPreviousRowPixel, applyConvolution } from './utils';


export enum CanvasModel {
  Preview = 'Preview',
  Crop = 'crop',
  Draw = 'draw',
  Styled = 'styled',
  Filter = 'filter',
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
  public saveImage() {
    var img = document.createElement('img');
    img.crossOrigin = "anonymous";
    img.src = this.image.imageElement.src

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = this.image.width;
      canvas.height = this.image.height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, this.image.sx, this.image.sy, this.image.sw, this.image.sh, 0, 0, this.image.width, this.image.height);
      const imageName = `cropped-image-${new Date().getTime()}.png`;
      canvas.toBlob((blob) => {
        if (blob) {
          // const editedFile = new File([blob], imageName, { type: blob.type });
          const objectUrl = URL.createObjectURL(blob);
          const linkElement = document.createElement('a');
          linkElement.download = `${imageName}`;
          linkElement.href = objectUrl;
          linkElement.click();
          URL.revokeObjectURL(objectUrl);
        }
      }, 'image/png');
    }
  }
  public drawLine() {
    // this.dragging = false
    // this.isDrawLine = true
  }
  public changeImageStyled(data: Record<ImageStyleKey, number>) {
    this.image.styleSettings.brightness = rangeTransform(-100, 100, -0.8, 1)(data.brightness)
    this.image.styleSettings.contrast = rangeTransform(-100, 100, 0, 2)(data.contrast)
    this.image.styleSettings.exposure = rangeTransform(-100, 100, -100, 100)(data.exposure)
    this.image.styleSettings.saturation = rangeTransform(-100, 100, 0, 2)(data.saturation)
    this.draw()
  }
  changeFilter(value: FilterType) {
    this.image.filterType = value
    this.draw()
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

    if ((this.canvasModel === CanvasModel.Styled || this.canvasModel === CanvasModel.Filter)
      &&
      this.image.isStyleSettings()
    ) {
      const { brightness, contrast, exposure, saturation } = this.image.styleSettings
      const imageData = this.ctx.getImageData(this.image.x * this.dpi, this.image.y * this.dpi, this.image.width * this.dpi, this.image.height * this.dpi)

      console.time();

      // 遍历每个像素，调整数值
      for (let i = 0; i < imageData.data.length; i += 4) {

        let r = imageData.data[i];
        let g = imageData.data[i + 1];
        let b = imageData.data[i + 2];
        let a = imageData.data[i + 3];

        const nextPixel = getNextPixel(imageData, i);
        const previousPixel = getPreviousPixel(imageData, i);
        const nextRowPixel = getNextRowPixel(imageData, i, imageData.width);
        const PreviousRowPixel = getPreviousRowPixel(imageData, i, imageData.width);
        const isLastRowPixel = isLastRow(i, imageData.width, imageData.height);
        const isCurRowLastPixel = isLastPixelInRow(i, imageData.width);
        // console.log({ r, g, b, a }, nextPixel, previousPixel, nextRowPixel, isLastRowPixel, isCurRowLastPixel);

        // 亮度
        r = Math.min(r * (1 + brightness), 255);
        g = Math.min(g * (1 + brightness), 255);
        b = Math.min(b * (1 + brightness), 255);

        // 对比度
        const avg = (r + g + b) / 3;
        r = Math.min(Math.max(((r - avg) * contrast) + avg + 128 * (contrast - 1), 0), 255);
        g = Math.min(Math.max(((g - avg) * contrast) + avg + 128 * (contrast - 1), 0), 255);
        b = Math.min(Math.max(((b - avg) * contrast) + avg + 128 * (contrast - 1), 0), 255);

        // 曝光
        r = Math.min(r + exposure, 255);
        g = Math.min(g + exposure, 255);
        b = Math.min(b + exposure, 255);

        // 饱和度
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = r * saturation + gray * (1 - saturation);
        g = g * saturation + gray * (1 - saturation);
        b = b * saturation + gray * (1 - saturation);

        // console.log(this.image.filterType);
        // 根据滤镜类型应用滤镜
        switch (this.image.filterType) {
          case FilterType.Normal:
            break;
          case FilterType.Grayscale:
            const gray = 0.21 * r + 0.72 * g + 0.07 * b;
            r = gray;
            g = gray;
            b = gray;
            break;
          case FilterType.Sepia:
            r = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
            g = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
            b = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
            break;
          case FilterType.Invert:
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
            break;
          case FilterType.Sharpen:
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
            break;
          case FilterType.fluorescence:
            r = r * 128 / (g + b + 1);
            g = g * 128 / (r + b + 1)
            b = b * 128 / (g + r + 1)
            break;
          case FilterType.threshold:
            var average = (r + g + a) / 3;
            r = g = b = average > 150 ? 255 : 0;
            break;
          case FilterType.Emboss:
            if (isLastRowPixel) {
              // 最后一行取上一行的当前点
              r = PreviousRowPixel!.r;
              g = PreviousRowPixel!.g;
              b = PreviousRowPixel!.b;
            } else {
              // 是当前行的最后一个点就取前一个点，否则就取下一行的当前点
              if (isCurRowLastPixel) {
                r = previousPixel!.r;
                g = previousPixel!.g;
                b = previousPixel!.b;
              } else {
                r = 255 / 2 + 2 * r - nextPixel!.r - nextRowPixel!.r;
                g = 255 / 2 + 2 * g - nextPixel!.g - nextRowPixel!.g;
                b = 255 / 2 + 2 * b - nextPixel!.b - nextRowPixel!.b;
              }
            }
            break;
          // case FilterType.Sharpen:
          //   // 应用锐化滤镜
          //   // 定义锐化滤镜的卷积核
          //   const SHARPEN_KERNEL = [
          //     [1, 1, 1],
          //     [1, -7, 1],
          //     [1, 1, 1]
          //   ];
          //   const { r: sharpenR, g: sharpenG, b: sharpenB } = applyConvolution(imageData, i, imageData.width, imageData.height, SHARPEN_KERNEL);
          //   r = sharpenR;
          //   g = sharpenG;
          //   b = sharpenB;
          //   break;
          default:
            console.log('Unsupported filter type');
        }

        imageData.data[i] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = a;
      }
      this.image.cacheStyleSettings = {
        ...this.image.styleSettings,
        width: this.image.width,
        height: this.image.height,
        filterType: this.image.filterType,
        imageData: imageData,
      }
      console.timeEnd();
    }

    if (this.image.cacheStyleSettings.imageData) {
      this.ctx.putImageData(this.image.cacheStyleSettings.imageData, this.image.x * this.dpi, this.image.y * this.dpi)
    }

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

