/**
 * 获取crop的辅助虚线
 * @param x
 * @param y
 * @param w
 * @param h
 */
export const getCropReferenceLine = (x: number, y: number, w: number, h: number) => {
  return [
    [x, y + h / 3, x + w, y + h / 3],
    [x, y + (2 * h) / 3, x + w, y + (2 * h) / 3],
    [x + w / 3, y, x + w / 3, y + h],
    [x + (2 * w) / 3, y, x + (2 * w) / 3, y + h],
  ]
}

/**
 * 获取crop的八个点
 * @param x
 * @param y
 * @param w
 * @param h
 */
export const getCropDot = (x: number, y: number, w: number, h: number, size: number) => {
  return [
    // 上
    [x + w / 2 - size / 2, y - size / 2, size, size],
    // 下
    [x + w / 2 - size / 2, y + h - size / 2, size, size],
    // 左
    [x - size / 2, y + h / 2 - size / 2, size, size],
    // 右
    [x + w - size / 2, y + h / 2 - size / 2, size, size],
    // 左上角
    [x - size / 2, y - size / 2, size, size],
    // 右上角
    [x + w - size / 2, y - size / 2, size, size],
    // 左下角
    [x - size / 2, y + h - size / 2, size, size],
    // 右下角
    [x + w - size / 2, y + h - size / 2, size, size],
  ]
}


/**
 * 获取crop的四条边
 * @param x
 * @param y
 * @param w
 * @param h
 */
export const getCropLine = (x: number, y: number, w: number, h: number, size: number) => {
  return [
    [x - size / 2, y - size / 2, w + size / 2, size],
    [x - size / 2, y + h - size / 2, w + 4, size],
    [x - size / 2, y - size / 2, size, h + size / 2],
    [x + w - size / 2, y - size / 2, size, h + size / 2],
  ]
}
