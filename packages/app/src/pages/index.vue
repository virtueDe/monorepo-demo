<script setup lang="ts" generic="T extends any, O extends any">
import { sum } from "@v50/edit-utils";
import type { ComponentPublicInstance } from 'vue';
type refItem = Element | ComponentPublicInstance | null

// console.log(sum(1, 2));


defineOptions({
  name: 'IndexPage',
})


/**
 * @module: Bar
 */
const currentBarIndex = ref(0)
const activeTranslateLeft = ref(0)
const barItemRefs = ref<refItem[]>([]);
const activeLine = ref<refItem>(null)


interface BarItem {
  icon: string,
  title: string,
  handle?: () => void
}

const barOption = ref<BarItem[]>([
  {
    icon: 'i-carbon:cursor-2',
    title: '查看',
    handle: () => {
      canvasInstance.value?.startCrop()
    }
  },
  {
    icon: 'i-carbon-cut-out',
    title: '裁剪',
    handle: () => {
      canvasInstance.value?.startCrop()
    }
  },
  {
    icon: 'i-carbon-awake',
    title: '亮度',
  },
  {
    icon: 'i-carbon-brush-freehand',
    title: '画笔',
    handle: () => {
      canvasInstance.value?.drawLine()
    }
  },
  {
    icon: 'i-carbon-edge-enhancement',
    title: '滤镜',
  },
  {
    icon: 'i-carbon-text-small-caps',
    title: '文字',
  },
])

onMounted(() => {
  initActiveTranslateLeft(0)
})

const handleChangeIndex = (item: BarItem, index: number) => {
  // if (currentBarIndex.value === index) return;

  currentBarIndex.value = index;
  initActiveTranslateLeft(currentBarIndex.value)

  item.handle?.()
}

const setBarItemRefs = (el: refItem) => {
  if (el)
    barItemRefs.value.push(el);
};

const initActiveTranslateLeft = (index: number) => {
  let marginTop = parseInt(window.getComputedStyle(barItemRefs.value[index] as Element).marginTop);
  let marginBottom = parseInt(window.getComputedStyle(barItemRefs.value[index] as Element).marginBottom);


  const b_offsetHeight = (barItemRefs.value[index] as HTMLElement).offsetHeight + marginTop + marginBottom
  console.log(marginTop, marginBottom, b_offsetHeight);
  const a_offsetHeight = (activeLine.value as HTMLElement).offsetHeight
  // 计算下划线位置
  activeTranslateLeft.value = b_offsetHeight * index + (b_offsetHeight - a_offsetHeight) / 2;
}

/**
 * @module: Image
 * feature:
 * 1. 基础画布功能：缩放、移动
 * 2. 裁剪：
 *     2.1：裁剪框裁剪图片
 *     2.2：水平垂直图片翻转
 *     2.3：图片旋转
 * 3. 亮度： 自然饱和度、饱和度、温度、色调、色相、亮度、曝光度、
 * 4. 滤镜：黑白滤镜、电影滤镜
 * 5. 画笔工具
 * 6. 文字工具
 */

class CanvasImageManipulator {
  /**
   * @description: canvas && Img
   */
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement = new Image();

  /**
   * @description: Scale
   * minScale 缩放最小比例
   * maxScale 缩放最大比例
   * scale 缩放比例
   * baseScale  // 基础缩放比例
   */
  private minScale: number = 0.1
  private maxScale: number = 10
  private baseScale: number = 1;
  public scale: number = 1;

  /**
   * @description: 距离边界的空隙
   */
  private margin: number = 100;

  private dpi: number = 1;

  /**
    * @description: 当前的坐标点
    */
  private originX: number = 0;
  private originY: number = 0;

  private angle: number = 0;

  private sourceX: number = 0;
  private sourceY: number = 0;
  private sourceWidth: number = 0;
  private sourceHeight: number = 0;

  private canvasOriginalWidth: number = 0;
  private canvasOriginalHeight: number = 0;


  private isEndCrop: boolean = false;

  /**
    * @description: 上次的坐标点
    */
  private lastX: number = 0;
  private lastY: number = 0;


  private flip: 'normal' | 'horizontal' | 'vertical' = 'normal'

  /**
    * @description: 缩放后的宽度高度
    */
  private scaleWidth: number = 0;
  private scaleHeight: number = 0;


  private lineX = 0
  private lineY = 0
  private lineWidth = 5
  private pathData = [{ "x": 377, "y": 107 }, { "x": 377, "y": 111 }, { "x": 377, "y": 111 }, { "x": 377, "y": 115 }, { "x": 377, "y": 115 }, { "x": 377, "y": 119 }, { "x": 377, "y": 119 }, { "x": 375, "y": 126 }, { "x": 375, "y": 126 }, { "x": 374, "y": 134 }, { "x": 374, "y": 134 }, { "x": 374, "y": 142 }, { "x": 374, "y": 142 }, { "x": 373, "y": 148 }, { "x": 373, "y": 148 }, { "x": 372, "y": 158 }, { "x": 372, "y": 158 }, { "x": 370, "y": 170 }, { "x": 370, "y": 170 }, { "x": 367, "y": 183 }, { "x": 367, "y": 183 }, { "x": 366, "y": 195 }, { "x": 366, "y": 195 }, { "x": 364, "y": 207 }, { "x": 364, "y": 207 }, { "x": 362, "y": 221 }, { "x": 362, "y": 221 }, { "x": 358, "y": 239 }, { "x": 358, "y": 239 }, { "x": 356, "y": 254 }, { "x": 356, "y": 254 }, { "x": 355, "y": 266 }, { "x": 355, "y": 266 }, { "x": 353, "y": 278 }, { "x": 353, "y": 278 }, { "x": 352, "y": 285 }, { "x": 352, "y": 285 }, { "x": 350, "y": 291 }, { "x": 350, "y": 291 }, { "x": 350, "y": 297 }, { "x": 350, "y": 297 }, { "x": 350, "y": 302 }, { "x": 350, "y": 302 }, { "x": 350, "y": 306 }, { "x": 350, "y": 306 }, { "x": 350, "y": 310 }, { "x": 350, "y": 310 }, { "x": 350, "y": 312 }, { "x": 350, "y": 312 }, { "x": 349, "y": 315 }, { "x": 349, "y": 315 }, { "x": 348, "y": 316 }, { "x": 348, "y": 316 }, { "x": 348, "y": 318 }, { "x": 348, "y": 318 }, { "x": 348, "y": 319 }, { "x": 348, "y": 319 }, { "x": 348, "y": 319 }, { "x": 348, "y": 319 }, { "x": 348, "y": 321 }, { "x": 348, "y": 321 }, { "x": 348, "y": 322 }, { "x": 348, "y": 322 }, { "x": 348, "y": 323 }, { "x": 348, "y": 323 }, { "x": 348, "y": 325 }, { "x": 348, "y": 325 }, { "x": 348, "y": 327 }, { "x": 348, "y": 327 }, { "x": 348, "y": 327 }, { "x": 348, "y": 327 }, { "x": 348, "y": 328 }, { "x": 348, "y": 328 }, { "x": 348, "y": 329 }, { "x": 348, "y": 329 }, { "x": 348, "y": 331 }, { "x": 348, "y": 331 }, { "x": 348, "y": 334 }, { "x": 348, "y": 334 }, { "x": 348, "y": 337 }, { "x": 348, "y": 337 }, { "x": 348, "y": 339 }, { "x": 348, "y": 339 }, { "x": 348, "y": 344 }, { "x": 348, "y": 344 }, { "x": 347, "y": 345 }, { "x": 347, "y": 345 }, { "x": 347, "y": 347 }, { "x": 347, "y": 347 }, { "x": 347, "y": 347 }, { "x": 347, "y": 347 }, { "x": 347, "y": 348 }, { "x": 347, "y": 348 }, { "x": 346, "y": 351 }, { "x": 346, "y": 351 }, { "x": 346, "y": 351 }, { "x": 346, "y": 351 }, { "x": 346, "y": 353 }, { "x": 346, "y": 353 }, { "x": 345, "y": 355 }, { "x": 345, "y": 355 }, { "x": 344, "y": 356 }, { "x": 344, "y": 356 }, { "x": 344, "y": 357 }, { "x": 344, "y": 357 }, { "x": 344, "y": 358 }, { "x": 344, "y": 358 }, { "x": 344, "y": 359 }, { "x": 344, "y": 359 }, { "x": 344, "y": 359 }, { "x": 344, "y": 359 }, { "x": 343, "y": 361 }, { "x": 343, "y": 361 }, { "x": 343, "y": 362 }, { "x": 343, "y": 362 }, { "x": 343, "y": 363 }, { "x": 343, "y": 363 }, { "x": 343, "y": 363 }, { "x": 343, "y": 363 }, { "x": 343, "y": 365 }, { "x": 343, "y": 365 }, { "x": 343, "y": 366 }, { "x": 343, "y": 366 }, { "x": 342, "y": 367 }, { "x": 342, "y": 367 }, { "x": 342, "y": 367 }, { "x": 342, "y": 367 }, { "x": 342, "y": 368 }, { "x": 342, "y": 368 }, { "x": 342, "y": 369 }, { "x": 342, "y": 369 }, { "x": 342, "y": 370 }, { "x": 342, "y": 370 }, { "x": 342, "y": 371 }, { "x": 342, "y": 371 }, { "x": 342, "y": 372 }, { "x": 342, "y": 372 }, { "x": 342, "y": 373 }, { "x": 342, "y": 373 }, { "x": 342, "y": 375 }, { "x": 342, "y": 375 }, { "x": 341, "y": 377 }, { "x": 341, "y": 377 }, { "x": 341, "y": 378 }, { "x": 341, "y": 378 }, { "x": 341, "y": 379 }, { "x": 341, "y": 379 }, { "x": 340, "y": 379 }, { "x": 340, "y": 379 }, { "x": 340, "y": 381 }, { "x": 340, "y": 381 }, { "x": 340, "y": 382 }, { "x": 340, "y": 382 }, { "x": 338, "y": 383 }, { "x": 338, "y": 383 }, { "x": 338, "y": 384 }, { "x": 338, "y": 384 }, { "x": 338, "y": 386 }, { "x": 338, "y": 386 }, { "x": 338, "y": 387 }, { "x": 338, "y": 387 }, { "x": 338, "y": 389 }, { "x": 338, "y": 389 }, { "x": 338, "y": 390 }, { "x": 338, "y": 390 }, { "x": 338, "y": 391 }, { "x": 338, "y": 391 }, { "x": 338, "y": 392 }, { "x": 338, "y": 392 }, { "x": 338, "y": 394 }, { "x": 338, "y": 394 }, { "x": 337, "y": 395 }, { "x": 337, "y": 395 }, { "x": 337, "y": 395 }, { "x": 337, "y": 395 }, { "x": 337, "y": 396 }, { "x": 337, "y": 396 }, { "x": 337, "y": 398 }, { "x": 337, "y": 398 }, { "x": 337, "y": 399 }, { "x": 337, "y": 399 }, { "x": 337, "y": 399 }, { "x": 337, "y": 399 }, { "x": 335, "y": 401 }, { "x": 335, "y": 401 }, { "x": 335, "y": 402 }, { "x": 335, "y": 402 }, { "x": 335, "y": 403 }, { "x": 335, "y": 403 }, { "x": 335, "y": 404 }, { "x": 335, "y": 404 }, { "x": 334, "y": 404 }, { "x": 334, "y": 404 }, { "x": 334, "y": 407 }, { "x": 334, "y": 407 }, { "x": 334, "y": 410 }, { "x": 334, "y": 410 }, { "x": 334, "y": 411 }, { "x": 334, "y": 411 }, { "x": 334, "y": 413 }, { "x": 334, "y": 413 }, { "x": 334, "y": 415 }, { "x": 334, "y": 415 }, { "x": 333, "y": 417 }, { "x": 333, "y": 417 }, { "x": 332, "y": 418 }, { "x": 332, "y": 418 }, { "x": 331, "y": 420 }, { "x": 331, "y": 420 }, { "x": 331, "y": 422 }, { "x": 331, "y": 422 }, { "x": 330, "y": 424 }, { "x": 330, "y": 424 }, { "x": 330, "y": 426 }, { "x": 330, "y": 426 }, { "x": 329, "y": 429 }, { "x": 329, "y": 429 }, { "x": 328, "y": 431 }, { "x": 328, "y": 431 }, { "x": 328, "y": 432 }, { "x": 328, "y": 432 }, { "x": 328, "y": 434 }, { "x": 328, "y": 434 }, { "x": 327, "y": 435 }, { "x": 327, "y": 435 }, { "x": 327, "y": 436 }, { "x": 327, "y": 436 }, { "x": 326, "y": 438 }, { "x": 326, "y": 438 }, { "x": 326, "y": 439 }, { "x": 326, "y": 439 }, { "x": 325, "y": 440 }, { "x": 325, "y": 440 }, { "x": 325, "y": 441 }, { "x": 325, "y": 441 }, { "x": 325, "y": 442 }, { "x": 325, "y": 442 }, { "x": 324, "y": 443 }, { "x": 324, "y": 443 }, { "x": 324, "y": 443 }, { "x": 324, "y": 443 }, { "x": 324, "y": 444 }, { "x": 324, "y": 444 }, { "x": 324, "y": 445 }, { "x": 324, "y": 445 }, { "x": 324, "y": 446 }]

  // private pathData: { x: number, y: number }[] = []


  private textAttribute = {
    fontSize: 50,
    data: 'hello Canvas',
    fontFamily: 'sans-serif',
    // font: '16px sans-serif',
    fillStyle: 'blue',
    textAlign: 'center',
    X: 150,
    y: 150
  }

  /**
    * @description: 裁剪框
    */
  private cutWidth: number = 0;
  private cutHeight: number = 0;
  private cutX: number = 0;
  private cutY: number = 0;
  private cutLineWidth: number = 2;
  private cutReferenceLineWidth: number = 1;
  private cutDotWidth: number = 40;

  private dragging: boolean = false;

  private cropping: boolean = false;
  // private isResizing: boolean = false;
  private resizeEdge: string | null = null;

  // 绘制线条
  private isDrawLine = false

  /***
   * @description: 鼠标在裁剪模块内
   * 1. crop: 鼠标在裁剪框内
   * 2. edge: 鼠标在裁剪框的边上
   * 3. corner: 鼠标在裁剪框的角上
   */
  private mouseInCropModule: 'crop' | 'edge' | 'corner' | null = null

  constructor(canvasId: string) {
    this.dpi = window.devicePixelRatio || 1;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    // this.canvas.width = this.canvas.parentElement!.clientWidth * this.dpi;
    // this.canvas.height = this.canvas.parentElement!.clientHeight * this.dpi;
    this.canvas.width = this.canvas.parentElement!.clientWidth;
    this.canvas.height = this.canvas.parentElement!.clientHeight;
    this.canvasOriginalWidth = this.canvas.parentElement!.clientWidth;
    this.canvasOriginalHeight = this.canvas.parentElement!.clientHeight;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.save()
    // this.ctx.scale(this.dpi, this.dpi)
    this.ctx.restore()
    this.initEventListeners();
  }
  public loadImage(src: string) {
    if (!src) return
    this.image.src = src;
    this.image.crossOrigin = 'anonymous'
    this.image.onload = () => {
      this.onResetImage()
      this.draw()
    };
  }
  public reversal(flipType: 'normal' | 'horizontal' | 'vertical' = 'horizontal') {
    this.flip = flipType
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // this.ctx.save();
    // this.ctx.scale(-1, 1);
    // this.originX = -this.canvas.width + this.originX;
    this.draw()
    // this.ctx.restore()
  }
  public saveImage() {

    var img = new Image()
    img.crossOrigin = "anonymous";
    img.src = this.image.src

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = this.sourceWidth;
      const height = this.sourceHeight;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(this.image, this.sourceX, this.sourceY, width, height, 0, 0, width, height);
      const imageName = 'cropped-image.png';
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
    this.dragging = false
    // this.isDrawLine = true
  }
  public changeLuminance(value: number) {
    const data = this.ctx.getImageData(this.originX * this.dpi, this.originY * this.dpi, this.scaleWidth * this.dpi, this.scaleHeight * this.dpi)

    const luminance = (imgData: ImageData, value: number) => {
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        const hsv = this.rgb2hsv([data[i], data[i + 1], data[i + 2]])
        hsv[2] *= (1 + value)
        const rgb = this.hsv2rgb([...hsv])
        data[i] = rgb[0];
        data[i + 1] = rgb[1];
        data[i + 2] = rgb[2];
      }
      return imgData
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(luminance(data, -0.5), this.originX * this.dpi, this.originY * this.dpi, 0, 0, this.scaleWidth * this.dpi, this.scaleHeight * this.dpi)
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
  public rotation(deg: number) {
    // console.log(deg);
    this.angle = deg
    // canvas 图片旋转
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    // this.ctx.rotate(deg * Math.PI / 180);
    // this.ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    this.draw()
  }
  private onResetImage() {
    const canvasAspect = this.canvasOriginalWidth / this.canvasOriginalHeight;
    const imageAspect = this.image.width / this.image.height;

    if (imageAspect > canvasAspect) {
      this.baseScale = (this.canvasOriginalWidth - 2 * this.margin) / this.image.width;
    } else {
      this.baseScale = (this.canvasOriginalHeight - 2 * this.margin) / this.image.height;
    }

    this.scale = this.baseScale;

    // 计算初始位置，使得图片居中
    this.originX = (this.canvasOriginalWidth - this.image.width * this.scale) / 2;
    this.originY = (this.canvasOriginalHeight - this.image.height * this.scale) / 2;

    // 计算新的宽度和高度
    this.scaleWidth = this.image.width * this.scale;
    this.scaleHeight = this.image.height * this.scale;
  }

  private initEventListeners() {
    this.canvas.addEventListener('mouseleave', (e) => {
      this.dragging = false;
    });
    document.addEventListener('mouseup', (e) => {
      if (!this.canvas.contains(e.target as Node)) {
        this.dragging = false;
      }
    });

    this.canvas.addEventListener('mousedown', this.startDragging.bind(this));
    this.canvas.addEventListener('mousemove', this.dragImage.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDragging.bind(this));

    this.canvas.addEventListener('wheel', this.zoomImage.bind(this));

    window.addEventListener('resize', () => {
      const newWidth = this.canvas.parentElement!.clientWidth;
      const newHeight = this.canvas.parentElement!.clientHeight

      const ratio = newWidth / this.canvasOriginalWidth

      this.originX *= ratio
      this.originY *= ratio
      this.scaleWidth *= ratio
      this.scaleHeight *= ratio

      this.textAttribute.X *= ratio
      this.textAttribute.y *= ratio
      this.textAttribute.fontSize *= ratio

      this.cutX *= ratio
      this.cutY *= ratio
      this.cutWidth *= ratio
      this.cutHeight *= ratio

      for (let index = 0; index < this.pathData.length; index++) {
        const point = this.pathData[index];
        point.x *= ratio
        point.y *= ratio
      }

      this.canvasOriginalWidth = newWidth;
      this.canvasOriginalHeight = newHeight;

      this.canvas.width = newWidth * this.dpi
      this.canvas.height = newHeight * this.dpi

      this.draw()

    });
  }
  private startDragging(event: MouseEvent) {
    if (event.buttons !== 1) return;
    // this.isDrawLine = true
    // if (this.isDrawLine) {
    //   [this.lineX, this.lineY] = [event.offsetX, event.offsetY]
    //   return
    // }
    this.dragging = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;

    const edge = this.getEdge(event.offsetX, event.offsetY)

    if (edge) {
      this.mouseInCropModule = 'edge'
      this.resizeEdge = edge;
    }

    if (this.isInCropBox(event.offsetX, event.offsetY)) {
      this.mouseInCropModule = 'crop'
    }

    // if (this.resizeEdge) {
    //   this.isResizing = true;
    // }

  }
  private dragImage(event: MouseEvent) {
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

    if (this.dragging) {
      const dx = mouseX - this.lastX;
      const dy = mouseY - this.lastY;

      this.lastX = mouseX;
      this.lastY = mouseY;

      if (this.cropping) {
        if (this.mouseInCropModule === 'edge') {
          mouseX = Math.max(mouseX, this.originX)
          mouseX = Math.min(mouseX, this.originX + this.scaleWidth)
          mouseY = Math.max(mouseY, this.originY)
          mouseY = Math.min(mouseY, this.originY + this.scaleHeight)
          switch (this.resizeEdge) {
            case "left":
              this.cutWidth += this.cutX - mouseX;
              this.cutX = mouseX;
              break;
            case "right":
              this.cutWidth = mouseX - this.cutX;
              break;
            case "top":
              this.cutHeight += this.cutY - mouseY;
              this.cutY = mouseY;
              break;
            case "bottom":
              this.cutHeight = mouseY - this.cutY;
              break;
          }
        }
        if (this.mouseInCropModule === 'crop') {
          this.cutX += dx;
          this.cutY += dy;

          // 确保裁剪框在图片范围内
          this.cutX = Math.max(
            this.cutX,
            this.originX
          );

          this.cutY = Math.max(
            this.cutY,
            this.originY
          );

          if (this.cutX + this.cutWidth > this.originX + this.scaleWidth) {
            this.cutX = this.originX + this.scaleWidth - this.cutWidth
          }

          if (this.cutY + this.cutHeight > this.originY + this.scaleHeight) {
            this.cutY = this.originY + this.scaleHeight - this.cutHeight
          }

        }
      } else {
        // if (this.flip === 'horizontal') {
        //   this.originX -= dx;
        //   this.originY += dy;
        // } else if (this.flip === 'vertical') {
        //   this.originX += dx;
        //   this.originY -= dy;
        // } else if (this.flip === 'normal') {
        this.originX += dx;
        this.originY += dy;
        for (let index = 0; index < this.pathData.length; index++) {
          const point = this.pathData[index];
          point.x += dx
          point.y += dy
        }


        this.textAttribute.X += dx
        this.textAttribute.y += dy
        // }
      }
      this.draw()
    } else {
      this.canvas.style.cursor = this.getCursorStyle(mouseX, mouseY);
    }
  }
  private getCorner(x: number, y: number) {
    const size = 10;
    // if (Math.abs(x - this.cutX) < size && Math.abs(y - this.cutY) < size)
    //   return "tl"; // top-left
    // if (
    //   Math.abs(x - (this.cutX + this.cutWidth)) < size &&
    //   Math.abs(y - this.cutY) < size
    // )
    //   return "tr"; // top-right
    // if (
    //   Math.abs(x - this.cutX) < size &&
    //   Math.abs(y - (this.cutY + this.cutHeight)) < size
    // )
    //   return "bl"; // bottom-left
    // if (
    //   Math.abs(x - (this.cutX + this.cutWidth)) < size &&
    //   Math.abs(y - (this.cutY + this.cutHeight)) < size
    // )
    //   return "br"; // bottom-right
    return null;
  }
  private getEdge(x: number, y: number) {
    if (Math.abs(x - this.cutX) < this.cutLineWidth) return "left";
    if (Math.abs(x - (this.cutX + this.cutWidth)) < this.cutLineWidth) return "right";
    if (Math.abs(y - this.cutY) < this.cutLineWidth) return "top";
    if (Math.abs(y - (this.cutY + this.cutHeight)) < this.cutLineWidth) return "bottom";
    return null;
  }
  private getCursorStyle(x: number, y: number) {
    const corner = this.getCorner(x, y);
    const edge = this.getEdge(x, y);
    if (corner) {
      switch (corner) {
        case "tl":
        case "br":
          return "nwse-resize";
        case "tr":
        case "bl":
          return "nesw-resize";
      }
    }
    if (edge) {
      switch (edge) {
        case "left":
        case "right":
          return "ew-resize";
        case "top":
        case "bottom":
          return "ns-resize";
      }
    }
    if (this.isInCropBox(x, y)) {
      return "move";
    }
    return "default";
  }
  private isInCropBox(x: number, y: number): boolean {
    return (
      x > this.cutX &&
      x < this.cutX + this.cutWidth &&
      y > this.cutY &&
      y < this.cutY + this.cutHeight
    );
  }
  private zoomImage(event: WheelEvent) {
    event.preventDefault();

    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    const wheel = event.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * 0.1);

    const newScale = this.scale * zoom;

    if (newScale < this.baseScale * this.minScale || newScale > this.baseScale * this.maxScale) return;


    // // 计算按照鼠标点进行缩放计算
    // this.originX = mouseX - (mouseX - this.originX) * zoom;
    // this.originY = mouseY - (mouseY - this.originY) * zoom;


    // 计算按照鼠标点进行缩放计算
    this.originX = (this.originX - mouseX) * zoom + mouseX;
    this.originY = (this.originY - mouseY) * zoom + mouseY;


    this.cutX = (this.cutX - mouseX) * zoom + mouseX
    this.cutY = (this.cutY - mouseY) * zoom + mouseY

    this.scale = newScale;

    // 计算新的宽度和高度
    this.scaleWidth = this.scaleWidth * zoom;
    this.scaleHeight = this.scaleHeight * zoom;

    this.cutWidth = this.cutWidth * zoom;
    this.cutHeight = this.cutHeight * zoom;

    this.lineWidth *= zoom


    for (let index = 0; index < this.pathData.length; index++) {
      const point = this.pathData[index];
      const newX = (point.x - mouseX) * zoom + mouseX;
      const newY = (point.y - mouseY) * zoom + mouseY;
      point.x = newX
      point.y = newY
    }

    this.textAttribute.X = (this.textAttribute.X - mouseX) * zoom + mouseX
    this.textAttribute.y = (this.textAttribute.y - mouseY) * zoom + mouseY
    this.textAttribute.fontSize = this.textAttribute.fontSize * zoom

    this.draw()
  }

  private stopDragging() {
    this.dragging = false;
    // this.isDrawLine = false
    // console.log(JSON.stringify(this.pathData));

    this.lastX = 0;
    this.lastY = 0;
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.cropping) {
      this.drawCover()
      this.drawCutBox()
    }

    if (!this.isEndCrop) {
      this.sourceWidth = this.image.width;
      this.sourceHeight = this.image.height;
      this.sourceX = 0;
      this.sourceY = 0;
    }

    this.drawImage()

    // this.ctx.restore()
    this.ctx.strokeStyle = `hsl(100, 90%, 50%)`;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    for (let index = 0; index < this.pathData.length; index++) {
      const point = this.pathData[index];
      if (index === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    }
    this.ctx.stroke();

    // 绘制文本
    this.ctx.font = `${this.textAttribute.fontSize}px ${this.textAttribute.fontFamily}`;
    this.ctx.textAlign = this.textAttribute.textAlign as CanvasTextAlign;
    this.ctx.fillStyle = this.textAttribute.fillStyle;
    this.ctx.fillText('Hello Canvas', this.textAttribute.X, this.textAttribute.y);
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
    // if (this.flip === 'horizontal') {
    //   this.ctx.scale(-1, 1);
    //   this.ctx.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, -this.canvas.width + this.originX, this.originY, this.scaleWidth, this.scaleHeight);
    // } else if (this.flip === 'vertical') {
    //   this.ctx.scale(1, -1);
    //   this.ctx.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.originX, -this.canvas.height + this.originY, this.scaleWidth, this.scaleHeight);
    // } else if (this.flip === 'normal') {
    //   this.ctx.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.originX, this.originY, this.scaleWidth, this.scaleHeight);
    // }

    this.ctx.translate(this.originX + this.scaleWidth / 2, this.originY + this.scaleHeight / 2);
    this.ctx.rotate(this.angle * Math.PI / 180);
    this.ctx.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, -this.scaleWidth / 2, -this.scaleHeight / 2, this.scaleWidth, this.scaleHeight);
    this.ctx.restore()
  }

  private drawCutBox() {
    this.ctx.save()

    // 绘制裁剪框
    this.ctx.strokeStyle = 'rgba(255,255,255)'
    this.ctx.lineWidth = this.cutLineWidth
    this.ctx.strokeRect(this.cutX, this.cutY, this.cutWidth, this.cutHeight)

    // 绘制参考线
    this.ctx.lineWidth = this.cutReferenceLineWidth
    this.ctx.strokeStyle = 'rgba(255,255,255,.2)'
    this.ctx.beginPath()
    this.ctx.moveTo(this.cutX, this.cutY + this.cutHeight / 3)
    this.ctx.lineTo(this.cutX + this.cutWidth, this.cutY + this.cutHeight / 3)
    this.ctx.moveTo(this.cutX, this.cutY + (this.cutHeight * 2) / 3)
    this.ctx.lineTo(this.cutX + this.cutWidth, this.cutY + (this.cutHeight * 2) / 3)
    this.ctx.moveTo(this.cutX + this.cutWidth / 3, this.cutY)
    this.ctx.lineTo(this.cutX + this.cutWidth / 3, this.cutY + this.cutHeight)
    this.ctx.moveTo(this.cutX + (this.cutWidth * 2) / 3, this.cutY)
    this.ctx.lineTo(this.cutX + (this.cutWidth * 2) / 3, this.cutY + this.cutHeight)
    this.ctx.stroke()

    // 绘制Dot线点

    // this.ctx.lineWidth = this.cutLineWidth
    // this.ctx.beginPath()

    // this.ctx.moveTo(this.cutX + this.cutWidth / 2 - this.cutDotWidth, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth / 2 + this.cutDotWidth, this.cutY - this.cutLineWidth)

    // this.ctx.moveTo(this.cutX + this.cutWidth / 2 - this.cutDotWidth, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth / 2 + this.cutDotWidth, this.cutY + this.cutHeight + this.cutLineWidth)


    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight / 2 - this.cutDotWidth)
    // this.ctx.lineTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight / 2 + this.cutDotWidth)

    // this.ctx.moveTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight / 2 - this.cutDotWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight / 2 + this.cutDotWidth)


    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutDotWidth / 2, this.cutY - this.cutLineWidth)
    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX - this.cutLineWidth, this.cutY + this.cutDotWidth / 2)


    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutDotWidth / 2, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight - this.cutDotWidth / 2)
    // this.ctx.lineTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight + this.cutLineWidth)


    // this.ctx.moveTo(this.cutX + this.cutWidth - this.cutDotWidth / 2, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY - this.cutLineWidth)
    // this.ctx.moveTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutDotWidth / 2)


    // this.ctx.moveTo(this.cutX + this.cutWidth - this.cutDotWidth / 2, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.moveTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight - this.cutDotWidth / 2)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight + this.cutLineWidth)

    // this.ctx.strokeStyle = 'rgba(255,255,255)'
    // this.ctx.stroke()

    this.ctx.restore()
  }
  private drawCover() {
    this.ctx.save()
    this.ctx.fillStyle = "rgba(0,0,0,0.5)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    // this.ctx.globalCompositeOperation = "source-atop"
    this.ctx.clearRect(this.cutX, this.cutY, this.cutWidth, this.cutHeight);
    this.ctx.restore()
  }
  public startCrop() {
    this.cropping = true

    this.onResetImage()

    this.cutX = this.originX - this.cutLineWidth / 2
    this.cutY = this.originY - this.cutLineWidth / 2
    this.cutWidth = this.scaleWidth + this.cutLineWidth
    this.cutHeight = this.scaleHeight + this.cutLineWidth

    this.draw()
  }
  public endCrop() {
    this.cropping = false
    this.isEndCrop = true

    this.sourceX = (this.cutX - this.originX) / this.scale;
    this.sourceY = (this.cutY - this.originY) / this.scale;
    this.sourceWidth = this.cutWidth / this.scale;
    this.sourceHeight = this.cutHeight / this.scale;

    this.originX = this.cutX
    this.originY = this.cutY
    this.scaleWidth = this.cutWidth
    this.scaleHeight = this.cutHeight

    this.draw()
  }
}

const canvasInstance = shallowRef<CanvasImageManipulator | null>(null)

// const canvasInstanceObj = ref({
//   instance: null as CanvasImageManipulator | null
// })

onMounted(() => {
  // canvasInstance.value = new CanvasImageManipulator('canvas')

  // canvasInstance.value?.loadImage('https://picsum.photos/id/237/300/300');
  // canvasInstance.value.
  // setInterval(() => {
  //   console.log(canvasInstanceObj.value.instance, canvasInstanceObj.value.instance?.scale);
  // }, 1000)
  // const canvasInstance = reactive(new CanvasImageManipulator('canvas'))
})
const imageFileName = ref('请上传图片')

const scale = computed(() => {
})

const handleEndCrop = () => {
  canvasInstance.value?.reversal()
}

const handleClickSavaImage = () => {
  canvasInstance.value?.saveImage()
}


const handleChangeUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      canvasInstance.value?.loadImage(e.target?.result as string);
      if (input.files && input.files.length > 0) {
        imageFileName.value = input.files[0].name;
      } else {
        // 处理input.files为空的情况，例如设置默认值或显示错误信息
        imageFileName.value = '请上传图片';
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}
const handleDragRange = (event: InputEvent) => {
  console.log((event.target as HTMLInputElement).value);

  // canvasInstance.value?.changeLuminance(Number((event.target as HTMLInputElement).value))
  canvasInstance.value?.rotation(Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div w-full h-full flex flex-col>
    <div h-60px w-full class="bg-[#1A212B] color-[#fff]" flex justify-between items-center>
      <div flex h-full items-center>
        <div rel="noreferrer" href="javascript:0" h-full w-60px flex justify-center items-center class="bg-[#24262b]">
          <div class="i-carbon-image-copy" font-size="25px"></div>
        </div>

        <div>
          <!-- <span pl-3 max-w-200px truncate :title="imageFileName">
            {{ imageFileName }}
          </span> -->
          <div>
            <!-- 点击 -->
            <input type="file" @change="handleChangeUpload($event)" id="uploadImage" accept="image/*">
          </div>
        </div>
      </div>
      <div flex font-size="22px" class="bar" pos-relative>
        <!-- <div :class="[item.icon, 'bar-item-btn']" :title="item.title" :ref="setBarItemRefs"
          v-for="(item, idx) in barOption" :key="idx" @click="handleChangeIndex(item, idx)"></div>
        <div class="active-line" ref="activeLine" pos-absolute w-18px h-5px left-0
          :style="{ left: activeTranslateLeft + 'px' }"></div> -->
      </div>
      <div class="right p-r-3">
        <div btn @click="handleClickSavaImage">保存</div>
      </div>
    </div>
    <div class="flex pos-relative flex-auto">
      <div class="h-100% color-[#fff] flex pos-relative">
        <!-- menu bar -->
        <div class="bg-[#292c31] pos-relative z-2">
          <!-- :class="[currentBarIndex === idx ? 'bg-#1A212B' : '']" -->
          <div class="group h-60px w-60px cursor-pointer flex items-center justify-center" :title="item.title"
            :ref="setBarItemRefs" v-for="(item, idx) in barOption" :key="idx" @click="handleChangeIndex(item, idx)">
            <div :class="[item.icon]"
              class="font-size-22px group-hover:color-[#A9A9A9] transition duration-200 ease-in-out">
            </div>
          </div>
          <div class="active-line pos-absolute w-6px h-30px right-0 top-0 bg-sky-500 transition-top" ref="activeLine"
            :style="{ top: activeTranslateLeft + 'px' }"></div>
        </div>
        <!-- tool -->
        <div
          class="h-100% w-280px bg-#292c31 border-l-1  border-black border-solid pos-absolute top-0 z-1 transition-transform duration-350"
          :class="[currentBarIndex !== 0 ? 'left-60px' : '-translate-x-100%']">
          <div></div>
        </div>
      </div>
      <div class="flex-auto bg-[#202020] border pos-absolute top-0 transition-left duration-350"
        :class="[currentBarIndex === 0 ? 'left-60px' : 'left-340px']">
        <canvas id="canvas"></canvas>
      </div>
    </div>
    <!-- <div h-40px w-full class="bg-[#23292c]" flex justify-between items-center> -->

    <!-- <div class=" color-[#fff]">{{ canvasInstance?.scale }}</div>
      <input type="range" max="360" value="0" min="0" step="1" @input="handleDragRange($event as InputEvent)">
      <div btn @click="handleEndCrop">
        确认裁剪
      </div> -->
    <!-- </div> -->
  </div>
</template>

<style scoped>
/* .bar>div:is(.bar-item-btn) {
  cursor: pointer;
  margin: 0px 8px;
}

.bar>div:is(.bar-item-btn):hover {
  color: #A9A9A9;
}

.active-line {
  background-color: rgb(13 148 136 / var(--un-bg-opacity));
  bottom: 0;
  transform: translateY(120%);
  transition: left 0.3s ease;
} */
</style>
