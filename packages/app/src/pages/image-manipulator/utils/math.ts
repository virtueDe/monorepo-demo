
/**
 * 值转换
 * @param fromMin
 * @param fromMax
 * @param toMin
 * @param toMax
 * @returns
 */
export const rangeTransform = (fromMin: number, fromMax: number, toMin: number, toMax: number): (x: number) => number => {
  const a = (toMax - toMin) / (fromMax - fromMin);
  const b = toMin - a * fromMin;

  return function transform(x: number): number {
    return a * x + b;
  };
}
