<script setup lang="ts" generic="T extends any, O extends any">
// import { sum } from "@v50/edit-utils";
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
  },
  {
    icon: 'i-carbon-cut-out',
    title: '裁剪',
  },
  {
    icon: 'i-carbon-awake',
    title: '调整',
  },
  {
    icon: 'i-carbon-brush-freehand',
    title: '画笔',
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


const rotate = ref(0)
interface CropBarItem extends BarItem { }
const cropBarOption = ref<CropBarItem[]>([
  {
    icon: 'i-carbon:rotate-counterclockwise',
    title: '向左旋转90度',
  },
  {
    icon: 'i-carbon:rotate-clockwise',
    title: '向右旋转90度',
  },
  {
    icon: 'i-carbon:reflect-horizontal',
    title: '水平翻转',
  },
  {
    icon: 'i-carbon:reflect-vertical',
    title: '垂直翻转',
  },

])

interface ColorOptionItem {
  min: number
  max: number
  value: number
  handle?: (e: Event, item: ColorOptionItem) => void
  title: string
}

const colorOption = ref<ColorOptionItem[]>([
  {
    min: -100,
    max: 100,
    value: 0,
    title: '亮度',
    handle: (e, item) => {
      console.log('亮度', e.target, item);
    }
  },
  {
    min: -100,
    max: 100,
    value: 0,
    title: '饱和度',
    handle: () => {
      console.log('饱和度');
    }
  },
  {
    min: -100,
    max: 100,
    value: 0,
    title: '对比度',
    handle: () => {
      console.log('对比度');
    }
  },
  {
    min: -100,
    max: 100,
    value: 0,
    title: '曝光度',
    handle: () => {
      console.log('曝光度');
    }
  }
])


const paintDrawType = ref([
  {
    icon: 'i-carbon:paint-brush-alt',
    title: '铅笔',
    value: 0,
    handle: () => {
    }
  },
  {
    icon: 'i-carbon:pen-fountain',
    title: '钢笔',
    value: 1,
    handle: () => {
    }
  },
])
const paintDrawTypeValue = ref(0)

const paintColor = ref([
  'red',
  'aqua',
  'yellow',
  'green',
  'purple',
  'pink',
  'orange',
  'brown',
  'gray',
  'black',
  'white',
  'blue',
  'teal',
  'olive',
  'maroon',
  'fuchsia'
])

const paintColorValue = ref('red')

const handleClickPaintColor = (item: string) => {
  paintColorValue.value = item
}

const filterTypeList = ref([
  {
    title: '黑白',
  },
  {
    title: '电影',
  },
  {
    title: '动漫',
  },
  {
    title: '人物',
  }
])

const filterTypeValue = ref('')


const fontStyleList = ref([
  {
    title: '加粗',
    icon: 'i-carbon:text-bold',
    use: false
  },
  {
    title: '斜体',
    icon: 'i-carbon:text-italic',
    use: false
  },
  {
    title: '下划线',
    icon: 'i-carbon:text-underline',
    use: false
  },
  {
    title: '删除线',
    icon: 'i-carbon:text-strikethrough',
    use: false
  }
])

onMounted(() => {
  initActiveTranslateLeft(0)
})

const handleChangeIndex = (item: BarItem, index: number) => {
  // if (currentBarIndex.value === index) return;

  currentBarIndex.value = index;
  initActiveTranslateLeft(currentBarIndex.value)


  setTimeout(() => {
    const width = document.getElementById('canvas')?.parentElement?.offsetWidth as number
    const height = document.getElementById('canvas')?.parentElement?.offsetHeight as number
    // console.log(width, height, document.getElementById('canvas')?.parentElement?.clientWidth);

    canvasInstance.value?.handleViewportResize(width, height)


    if (index === 1) {
      canvasInstance.value?.switchCanvasModel(CanvasModel.Crop)
    }
  })

}

const setBarItemRefs = (el: refItem) => {
  if (el)
    barItemRefs.value.push(el);
};

const initActiveTranslateLeft = (index: number) => {
  let marginTop = parseInt(window.getComputedStyle(barItemRefs.value[index] as Element).marginTop);
  let marginBottom = parseInt(window.getComputedStyle(barItemRefs.value[index] as Element).marginBottom);


  const b_offsetHeight = (barItemRefs.value[index] as HTMLElement).offsetHeight + marginTop + marginBottom
  const a_offsetHeight = (activeLine.value as HTMLElement).offsetHeight
  // 计算下划线位置
  activeTranslateLeft.value = b_offsetHeight * index + (b_offsetHeight - a_offsetHeight) / 2;
}


class Image {
  imageElement: HTMLImageElement = document.createElement('img');
  margin: number = 20;
  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 0
  angle: number = 0;
  constructor() { }
}

enum MouseInCropModule {
  InCrop = 'inCrop',
  InOut = 'inOut',

  InDot = 'inDot',

  InTop = 'inTop',
  InBottom = 'inBottom',
  InLeft = 'inLeft',
  InRight = 'inRight',
}


class CropRect {
  width: number = 0
  height: number = 0
  x: number = 0
  y: number = 0
  lineWidth: number = 6
  referenceLineWidth: number = 1;
  DotSize: number = 20;
  InCropModule: MouseInCropModule = MouseInCropModule.InOut
  constructor() { }
}

enum CanvasModel {
  Preview = 'Preview',
  Crop = 'crop',
  Draw = 'draw',
  Text = 'Text',
}

class CanvasImageManipulator {
  /**
   * @description: canvas && Img
   */
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
  public rotation(deg: number) {
    // console.log(deg);
    // this.angle = deg
    // canvas 图片旋转
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    // this.ctx.rotate(deg * Math.PI / 180);
    // this.ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    // this.draw()
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
    console.log(width, height);
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
    // this.isDrawLine = true
    // if (this.isDrawLine) {
    //   [this.lineX, this.lineY] = [event.offsetX, event.offsetY]
    //   return
    // }
    this.mouse.dragging = true;
    this.mouse.lastX = event.offsetX;
    this.mouse.lastY = event.offsetY;

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

  }
  private handleMousemove(event: MouseEvent) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    const dx = mouseX - this.mouse.lastX;
    const dy = mouseY - this.mouse.lastY;

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

      this.mouse.lastX = mouseX;
      this.mouse.lastY = mouseY;

      // if (this.cropping) {
      // if (this.mouseInCropModule === 'edge') {
      //   mouseX = Math.max(mouseX, this.originX)
      //   mouseX = Math.min(mouseX, this.originX + this.scaleWidth)
      //   mouseY = Math.max(mouseY, this.originY)
      //   mouseY = Math.min(mouseY, this.originY + this.scaleHeight)
      //   switch (this.resizeEdge) {
      //     case "left":
      //       this.cutWidth += this.cutX - mouseX;
      //       this.cutX = mouseX;
      //       break;
      //     case "right":
      //       this.cutWidth = mouseX - this.cutX;
      //       break;
      //     case "top":
      //       this.cutHeight += this.cutY - mouseY;
      //       this.cutY = mouseY;
      //       break;
      //     case "bottom":
      //       this.cutHeight = mouseY - this.cutY;
      //       break;
      //   }
      // }
      // if (this.mouseInCropModule === 'crop') {
      //   this.cutX += dx;
      //   this.cutY += dy;

      //   // 确保裁剪框在图片范围内
      //   this.cutX = Math.max(
      //     this.cutX,
      //     this.originX
      //   );

      //   this.cutY = Math.max(
      //     this.cutY,
      //     this.originY
      //   );

      //   if (this.cutX + this.cutWidth > this.originX + this.scaleWidth) {
      //     this.cutX = this.originX + this.scaleWidth - this.cutWidth
      //   }

      //   if (this.cutY + this.cutHeight > this.originY + this.scaleHeight) {
      //     this.cutY = this.originY + this.scaleHeight - this.cutHeight
      //   }

      // }
      // } else {
      // if (this.flip === 'horizontal') {
      //   this.originX -= dx;
      //   this.originY += dy;
      // } else if (this.flip === 'vertical') {
      //   this.originX += dx;
      //   this.originY -= dy;
      // } else if (this.flip === 'normal') {
      this.image.x += dx;
      this.image.y += dy;


      // for (let index = 0; index < this.pathData.length; index++) {
      //   const point = this.pathData[index];
      //   point.x += dx
      //   point.y += dy
      // }


      // this.textAttribute.X += dx
      // this.textAttribute.y += dy
      // }
      // }
      this.draw()
    } else {
      // this.canvas.style.cursor = this.getCursorStyle(mouseX, mouseY);
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
    // if (Math.abs(x - this.cutX) < this.cutLineWidth) return "left";
    // if (Math.abs(x - (this.cutX + this.cutWidth)) < this.cutLineWidth) return "right";
    // if (Math.abs(y - this.cutY) < this.cutLineWidth) return "top";
    // if (Math.abs(y - (this.cutY + this.cutHeight)) < this.cutLineWidth) return "bottom";
    // return null;
  }
  private getCursorStyle(x: number, y: number) {
    // const corner = this.getCorner(x, y);
    // const edge = this.getEdge(x, y);
    // if (corner) {
    //   switch (corner) {
    //     case "tl":
    //     case "br":
    //       return "nwse-resize";
    //     case "tr":
    //     case "bl":
    //       return "nesw-resize";
    //   }
    // }
    // if (edge) {
    //   switch (edge) {
    //     case "left":
    //     case "right":
    //       return "ew-resize";
    //     case "top":
    //     case "bottom":
    //       return "ns-resize";
    //   }
    // }
    // if (this.isInCropBox(x, y)) {
    //   return "move";
    // }
    // return "default";
  }
  // private isInCropBox(x: number, y: number): boolean {
  //   return (
  //     x > this.cutX &&
  //     x < this.cutX + this.cutWidth &&
  //     y > this.cutY &&
  //     y < this.cutY + this.cutHeight
  //   );
  // }
  private handleWheel(event: WheelEvent) {
    event.preventDefault();

    let centreX = event.offsetX;
    let centreY = event.offsetY;

    const wheel = event.deltaY < 0 ? 1 : -1;

    const zoom = Math.exp(wheel * 0.1);

    const newScale = this.canvasScale.value * zoom;

    if (newScale < this.canvasScale.min || newScale > this.canvasScale.max) return;

    // 计算按照鼠标点进行缩放计算
    this.image.x = (this.image.x - centreX) * zoom + centreX;
    this.image.y = (this.image.y - centreY) * zoom + centreY;


    // this.cutX = (this.cutX - mouseX) * zoom + mouseX
    // this.cutY = (this.cutY - mouseY) * zoom + mouseY

    this.canvasScale.value = newScale;

    // // 计算新的宽度和高度
    this.image.width = this.image.width * zoom;
    this.image.height = this.image.height * zoom;

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
      this.drawCover()
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
    // if (this.flip === 'horizontal') {
    //   this.ctx.scale(-1, 1);
    //   this.ctx.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, -this.canvas.width + this.originX, this.originY, this.scaleWidth, this.scaleHeight);
    // } else if (this.flip === 'vertical') {
    //   this.ctx.scale(1, -1);
    //   this.ctx.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.originX, -this.canvas.height + this.originY, this.scaleWidth, this.scaleHeight);
    // } else if (this.flip === 'normal') {
    //   this.ctx.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.originX, this.originY, this.scaleWidth, this.scaleHeight);
    // }

    this.ctx.translate(this.image.x + this.image.width / 2, this.image.y + this.image.height / 2);
    this.ctx.rotate(this.image.angle * Math.PI / 180);
    this.ctx.drawImage(this.image.imageElement, 0, 0, this.image.imageElement.width, this.image.imageElement.height, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);
    this.ctx.restore()
  }

  private drawCropRect() {
    this.ctx.save()

    // 绘制裁剪框
    this.ctx.strokeStyle = 'rgba(255,255,255)'
    this.ctx.lineWidth = this.cropRect.lineWidth
    this.ctx.strokeRect(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height)

    // 绘制参考线
    this.ctx.lineWidth = this.cropRect.referenceLineWidth
    this.ctx.strokeStyle = 'rgba(255,255,255,.2)'
    this.ctx.beginPath()
    this.ctx.moveTo(this.cropRect.x, this.cropRect.y + this.cropRect.height / 3)
    this.ctx.lineTo(this.cropRect.x + this.cropRect.width, this.cropRect.y + this.cropRect.height / 3)
    this.ctx.moveTo(this.cropRect.x, this.cropRect.y + (this.cropRect.height * 2) / 3)
    this.ctx.lineTo(this.cropRect.x + this.cropRect.width, this.cropRect.y + (this.cropRect.height * 2) / 3)
    this.ctx.moveTo(this.cropRect.x + this.cropRect.width / 3, this.cropRect.y)
    this.ctx.lineTo(this.cropRect.x + this.cropRect.width / 3, this.cropRect.y + this.cropRect.height)
    this.ctx.moveTo(this.cropRect.x + (this.cropRect.width * 2) / 3, this.cropRect.y)
    this.ctx.lineTo(this.cropRect.x + (this.cropRect.width * 2) / 3, this.cropRect.y + this.cropRect.height)
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
  }
  public initCrop() {
    this.cropRect.width = this.image.width + this.cropRect.lineWidth
    this.cropRect.height = this.image.height + this.cropRect.lineWidth
    this.cropRect.x = this.image.x - this.cropRect.lineWidth / 2
    this.cropRect.y = this.image.y - this.cropRect.lineWidth / 2

    // this.onResetImage()

    this.draw()
  }
  // public endCrop() {
  //   // this.cropping = false
  //   // this.isEndCrop = true

  //   // this.sourceX = (this.cutX - this.originX) / this.scale;
  //   // this.sourceY = (this.cutY - this.originY) / this.scale;
  //   // this.sourceWidth = this.cutWidth / this.scale;
  //   // this.sourceHeight = this.cutHeight / this.scale;

  //   // this.originX = this.cutX
  //   // this.originY = this.cutY
  //   // this.scaleWidth = this.cutWidth
  //   // this.scaleHeight = this.cutHeight

  // this.draw()
  // }
}

const canvasInstance = shallowRef<CanvasImageManipulator | null>(null)

// const canvasInstanceObj = ref({
//   instance: null as CanvasImageManipulator | null
// })

onMounted(() => {
  canvasInstance.value = new CanvasImageManipulator('canvas')
  // canvasInstance.value?.loadImage('./hjNvQge.jpeg');
  canvasInstance.value?.loadImage('https://picsum.photos/id/237/300/300');

  // setTimeout(() => {
  //   canvasInstance.value?.loadImage('./hjNvQge.jpeg');
  // }, 1000)
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
          <div class="pos-absolute w-6px h-30px right-0 top-0 bg-sky-500 transition-top" ref="activeLine"
            :style="{ top: activeTranslateLeft + 'px' }"></div>
        </div>
        <!-- tool -->
        <!-- transition-transform duration-350 -->
        <div class="p12px h-100% w-280px bg-#292c31 border-l-1  border-black border-solid pos-absolute top-0 z-1"
          :class="[currentBarIndex !== 0 ? 'left-60px' : '-translate-x-100%']">
          <div class="font-size-16p mb-12px">{{ barOption[currentBarIndex].title }}</div>
          <!-- crop -->
          <div v-if="currentBarIndex === 1"
            class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px">
            <div class="text-left mb12px font-size-14px">旋转与翻转</div>
            <div class="flex">
              <input class="w-100%" type="range" min="-180" max="180" v-model="rotate" step="1">
              <div class="ml10px w-40px">{{ rotate }}°</div>
            </div>
            <div class="flex justify-between group mt12px mb12px">
              <div :class="[item.icon]"
                class="cursor-pointer font-size-18px hover:color-[#A9A9A9] transition duration-200 ease-in-out"
                v-for="(item, idx) in cropBarOption" :key="idx" :title="item.title"></div>
            </div>
          </div>
          <div v-if="currentBarIndex === 2"
            class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px">
            <div class="flex font-size-14px mb-20px" v-for="(item, idx) in colorOption" :key="idx">
              <div class="mr10px">{{ item.title }}</div>
              <input @input="(e) => item.handle && item.handle(e, item)" class="w-100% flex-1" type="range"
                :min="item.min" :max="item.max" v-model="item.value" step="1">
              <div class="ml10px w-40px">{{ item.value }}</div>
            </div>

          </div>
          <div v-if="currentBarIndex === 3">
            <div class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px flex flex-gap-8px">
              <div class="flex-auto cup rounded-8px h-36px flex items-center justify-center bg-[#383A3E]"
                v-for="(item, idx) in paintDrawType" :key="idx"
                :class="[item.value === paintDrawTypeValue ? 'bg-primary' : '']"
                @click="paintDrawTypeValue = item.value" :title="item.title">
                <div :class="[item.icon]"></div>
              </div>
            </div>
            <div
              class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px flex flex-gap-9px flex-wrap">
              <div v-for="(item, idx) in paintColor" :key="idx" class="w20px h20px cursor-pointer rounded-2px"
                :style="{ backgroundColor: item }"
                :class="[item === paintColorValue ? 'border-1 border-solid border-primary shadow-md shadow-blue-500/40' : '']"
                @click="handleClickPaintColor(item)">
              </div>
            </div>
          </div>
          <div v-if="currentBarIndex === 4"
            class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px flex flex-gap-8px flex-wrap">
            <div v-for="(item, idx) in filterTypeList" :key="idx" @click="filterTypeValue = item.title"
              :class="[item.title === filterTypeValue ? 'border-1 border-solid border-primary shadow-md shadow-blue-500/40' : '']"
              class="flex-auto bg-[#383A3E] rounded-2px font-size-12px color-[#868686] cup h-200px w-100px flex items-center justify-center">
              {{
                item.title
              }}
            </div>
          </div>
          <div v-if="currentBarIndex === 5"
            class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px">
            <div class="flex font-size-14px mb-20px justify-center">
              <div class="mr10px">字体大小</div>
              <input type="number" value="14" list="defaultNumbers" min="2" max="200" step="1" class="w-100% flex-1">
              <datalist id="defaultNumbers">
                <option value="18"></option>
                <option value="24"></option>
                <option value="36"></option>
                <option value="72"></option>
              </datalist>
            </div>
            <div class="flex font-size-14px mb-20px">
              <div class="mr10px">文本颜色</div>
              <input class="w-100% flex-1" type="color" value="#fff">
            </div>
            <div class="flex justify-between font-size-18px gap-10px">
              <div class="flex-1 cup bg-[#383A3E] flex items-center justify-center p6px rounded-5px"
                v-for="(item, idx) in fontStyleList" :key="idx" :class="[item.use ? 'bg-primary' : '']"
                @click="item.use = !item.use">
                <div :class="[item.icon]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- transition-left duration-350 -->
      <div class="h-100% flex-auto bg-[#202020] pos-absolute top-0 box-border"
        :class="[currentBarIndex === 0 ? 'left-60px w-[calc(100%-60px)]' : 'left-340px w-[calc(100%-340px)]']">
        <canvas id="canvas"></canvas>
      </div>
    </div>
    <!-- <img class="w100px h100px" src="./hjNvQge.jpeg" alt="" srcset=""> -->
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
