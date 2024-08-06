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
