/**
 * 判断x,y是否在路径上
 * @param pathX
 * @param pathY
 */
export const checkInPath = (x: number, y: number, rectPoint: number[], ctx: CanvasRenderingContext2D): boolean => {
  ctx.beginPath()
  ctx.rect(rectPoint[0], rectPoint[1], rectPoint[2], rectPoint[3])
  const result = ctx.isPointInPath(x, y)
  ctx.closePath()
  return result
}

/**
 * hsv转rgb
 * @param hsv
 * @returns
 */
export const hsvTORgb = (hsv: number[]) => {
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

/**
 * rgb转hsv
 * @param hsv
 * @returns
 */
export const rgbToHsv = (arr: number[]) => {
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

/**
 * 获取下一个像素点的 RGBA 值
 */
export const getNextPixel = (imageData: ImageData, i: number) => {
  const nextIndex = i + 4;
  if (nextIndex < imageData.data.length && (nextIndex + 3) < imageData.data.length) {
    const r = imageData.data[nextIndex];
    const g = imageData.data[nextIndex + 1];
    const b = imageData.data[nextIndex + 2];
    const a = imageData.data[nextIndex + 3];
    return { r, g, b, a };
  }
  return null;
}

/**
 * 获取前一个像素点的 RGBA 值
 */
export const getPreviousPixel = (imageData: ImageData, i: number) => {
  const previousIndex = i - 4;
  if (previousIndex >= 0 && (previousIndex + 3) < imageData.data.length) {
    const r = imageData.data[previousIndex];
    const g = imageData.data[previousIndex + 1];
    const b = imageData.data[previousIndex + 2];
    const a = imageData.data[previousIndex + 3];
    return { r, g, b, a };
  }
  return null;
}
/**
 * 获取下一行的当前点的 RGBA 值
 */
export const getNextRowPixel = (imageData: ImageData, i: number, width: number) => {
  const nextRowIndex = i + 4 * width;
  if (nextRowIndex < imageData.data.length && (nextRowIndex + 3) < imageData.data.length) {
    const r = imageData.data[nextRowIndex];
    const g = imageData.data[nextRowIndex + 1];
    const b = imageData.data[nextRowIndex + 2];
    const a = imageData.data[nextRowIndex + 3];
    return { r, g, b, a };
  }
  return null;
}
/**
 * 获取上一行的当前点的 RGBA 值
 */
export const getPreviousRowPixel = (imageData: ImageData, i: number, width: number) => {
  const previousRowIndex = i - 4 * width;
  if (previousRowIndex >= 0 && (previousRowIndex + 3) < imageData.data.length) {
    const r = imageData.data[previousRowIndex];
    const g = imageData.data[previousRowIndex + 1];
    const b = imageData.data[previousRowIndex + 2];
    const a = imageData.data[previousRowIndex + 3];
    return { r, g, b, a };
  }
  return null;
}

/**
 * 判断当前像素点是否位于最后一行
 */
export const isLastRow = (i: number, width: number, height: number) => {
  return Math.floor(i / (4 * width)) === height - 1;
}
/**
 * 判断当前像素点是否是当前行的最后一个点
 */
export const isLastPixelInRow = (i: number, width: number) => {
  // 计算当前行最后一个像素点的索引
  const lastPixelIndexInRow = (Math.floor(i / (4 * width)) * (4 * width)) + (4 * width) - 1;
  return i + 3 === lastPixelIndexInRow;
}

/**
 * 锐化
 * @param imageData
 * @param i
 * @param width
 * @param height
 * @param kernel
 * @returns
 */
export const applyConvolution = (imageData: ImageData, i: number, width: number, height: number, kernel: number[][]) => {
  let r = 0, g = 0, b = 0;

  // 应用卷积核
  for (let ky = -1; ky <= 1; ky++) {
    for (let kx = -1; kx <= 1; kx++) {
      const kernelValue = kernel[ky + 1][kx + 1];
      const pixelIndex = ((Math.floor(i / 4) + ky) * width + (i % 4 / 4 + kx)) * 4;

      r += imageData.data[pixelIndex] * kernelValue;
      g += imageData.data[pixelIndex + 1] * kernelValue;
      b += imageData.data[pixelIndex + 2] * kernelValue;
    }
  }

  // 将结果限制在 0-255 范围内
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return { r, g, b };
}

