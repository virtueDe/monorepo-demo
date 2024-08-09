
export type ImageStyleKey = 'brightness' | 'contrast' | 'exposure' | 'saturation';

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
  styleSettings: Record<ImageStyleKey, number> = {
    /**亮度 值范围 -1~1 */
    brightness: 0,
    /**对比度 */
    contrast: 1,
    /**曝光度 */
    exposure: 0,
    /**饱和度 */
    // 调整饱和度，例如降低50%
    saturation: 1,
  };
  constructor() { }
}
