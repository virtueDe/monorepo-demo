
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

  /** 图片风格设置 */
  styleSettings: ImageEffectValues = {
    /**亮度 值范围 -0.8 ~ 1  0 是正常*/
    brightness: 0,
    /**对比度 值范围0-2  1是正常 **/
    contrast: 1,
    /**曝光度 值范围-100-100  0是正常 */
    exposure: 0,
    /**饱和度 值范围0-2  1是正常*/
    saturation: 1,
  };

  cacheStyleSettings!: ExtendedImageEffectValues;

  filterType: FilterType = FilterType.Normal

  constructor() {
    this.cacheStyleSettings = {
      ...this.styleSettings,
      width: this.width,
      height: this.height,
      filterType: this.filterType,
      imageData: null,
    }
  }
  isStyleSettings() {
    const settingsObj = { width: this.width, height: this.height, filterType: this.filterType, ...this.styleSettings }
    const flag = Object.keys(settingsObj).some(key => {
      return settingsObj[key as ImageStyleKey] !== this.cacheStyleSettings[key as ImageStyleKey]
    })
    return flag
  }
}
