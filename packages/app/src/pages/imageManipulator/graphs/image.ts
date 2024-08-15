
export type ImageStyleKey = 'brightness' | 'contrast' | 'exposure' | 'saturation';

type ImageEffectValues = Record<ImageStyleKey, number>;
// 扩展类型
type ExtendedImageEffectValues = ImageEffectValues & {
  width: number;
  height: number;
  imageData: ImageData | null;
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
  constructor() {
    this.cacheStyleSettings = {
      ...this.styleSettings,
      width: this.width,
      height: this.height,
      imageData: null,
    }
  }
  isStyleSettings() {
    const settingsObj = { width: this.width, height: this.height, ...this.styleSettings }
    const flag = Object.keys({ width: this.width, height: this.height, ...this.styleSettings }).some(key => {
      return settingsObj[key as ImageStyleKey] !== this.cacheStyleSettings[key as ImageStyleKey]
    })
    return flag
  }
}
