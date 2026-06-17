/** 生成 [min, max] 范围内的随机整数 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 从数组中随机选取一个元素 */
export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 按概率返回 true */
export function chance(probability: number): boolean {
  return Math.random() < probability;
}
