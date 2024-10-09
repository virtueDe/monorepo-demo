import { CanvasImageManipulator, getNextPixel, getNextRowPixel, getPreviousPixel, getPreviousRowPixel, isLastPixelInRow, isLastRow } from "..";

export type ImageStyleKey = 'brightness' | 'contrast' | 'exposure' | 'saturation';

export enum FilterType {
  /**
    * 无效果
    */
  Normal = 'normal',
  /**
    * 灰度滤镜 - 将彩色图像转换为黑白图像。
    */
  Grayscale = 'grayscale',
  /**
   * 怀旧滤镜 - 为图像添加一种复古或怀旧的外观。
   */
  Sepia = 'sepia',
  /**
   * 反色滤镜 - 将图像的颜色完全反转。
   */
  Invert = 'invert',
  /**
   * 锐化滤镜 - 增强图像细节，使图像更清晰。
   */
  Sharpen = 'sharpen',
  /**
   * 像素化滤镜 - 将图像分割成较大的像素块。
   */
  Pixelate = 'pixelate',
  /**
   * 浮雕滤镜 - 创建一种浮雕或凸起的效果。
   */
  Emboss = 'emboss',
  /**
   * 荧光滤镜 - 创建一种浮雕或凸起的效果。
   */
  fluorescence = 'Fluorescence',
  /**
   * 阈值 - 创建一种浮雕或凸起的效果。
   */
  threshold = 'Threshold',
}

type ImageEffectValues = Record<ImageStyleKey, number>;

// 扩展类型
type ExtendedImageEffectValues = ImageEffectValues & {
  width: number;
  height: number;
  imageData: ImageData | null;
  filterType: FilterType
};

const defaultStyled: ImageEffectValues = {
  brightness: 0,
  contrast: 1,
  exposure: 0,
  saturation: 1,
} as const

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

  // /** 图片风格设置 */
  // styleSettings: ImageEffectValues = {
  //   /**亮度 值范围 -0.8 ~ 1  0 是正常*/
  //   brightness: 0,
  //   /**对比度 值范围0-2  1是正常 **/
  //   contrast: 1,
  //   /**曝光度 值范围-100-100  0是正常 */
  //   exposure: 0,
  //   /**饱和度 值范围0-2  1是正常*/
  //   saturation: 1,
  // };
  /** 图片风格设置 */
  styled!: ImageEffectValues

  cache!: ExtendedImageEffectValues;

  filterType!: FilterType

  constructor(private rootCanvas: CanvasImageManipulator) {
    // TODO: 深拷贝后面要改
    this.styled = JSON.parse(JSON.stringify(defaultStyled))

    this.filterType = FilterType.Normal

    this.cache = {
      ...this.styled,
      width: this.width,
      height: this.height,
      filterType: this.filterType,
      imageData: null,
    }
  }
  isDrawImgStyled() {
    // 检查样式是否发生变化
    const hasStyleChanged = Object.keys(this.styled).some(key =>
      this.styled[key as ImageStyleKey] !== this.cache[key as ImageStyleKey]
    );

    // 检查滤镜是否发生变化
    const hasFilterChanged = this.filterType !== this.cache.filterType;


    const _default = {
      ...defaultStyled,
      filterType: FilterType.Normal
    }
    const _styled = {
      ...this.styled,
      filterType: this.filterType
    }

    // 样式滤镜是否默认值
    const isDefaultStyled = Object.keys(_default).some(key => {
      return _styled[key as ImageStyleKey] !== _default[key as ImageStyleKey]
    });

    // 检查尺寸是否发生变化
    const hasSizeChanged = isDefaultStyled && (this.width !== this.cache.width || this.height !== this.cache.height);

    // 如果样式或滤镜发生变化，或者尺寸变化且（样式或滤镜发生变化），返回true
    return hasStyleChanged || hasFilterChanged || hasSizeChanged;
  }
  draw() {
    console.time('drawImage');
    const { ctx, dpi, scale } = this.rootCanvas;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    // 中心点
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    // 翻转
    ctx.scale(this.flip.x, this.flip.y);
    // 旋转
    ctx.rotate(this.angle * Math.PI / 180);

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = this.width * dpi;
    offscreenCanvas.height = this.height * dpi;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx!.scale(dpi, dpi)
    offscreenCtx!.drawImage(this.imageElement, this.sx, this.sy, this.sw, this.sh, 0, 0, this.width, this.height);

    // 渲染
    // ctx.drawImage(this.imageElement, this.sx, this.sy, this.sw, this.sh, -this.width / 2, -this.height / 2, this.width, this.height);

    if (this.isDrawImgStyled()) {

      console.log('计算');

      const { brightness, contrast, exposure, saturation } = this.styled
      const imageData = offscreenCtx!.getImageData(0, 0, this.width * dpi, this.height * dpi)

      console.time('drawImageStyle');

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

        // 根据滤镜类型应用滤镜
        switch (this.filterType) {
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
          default:
            console.log('Unsupported filter type');
        }

        imageData.data[i] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = a;
      }
      this.cache = {
        ...this.styled,
        width: this.width,
        height: this.height,
        filterType: this.filterType,
        imageData: imageData,
      }
      console.timeEnd('drawImageStyle');
    }

    if (this.cache.imageData) {
      offscreenCtx!.putImageData(this.cache.imageData, 0, 0);
    }

    ctx.drawImage(offscreenCanvas, -this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();
    console.timeEnd('drawImage');
  }
}
