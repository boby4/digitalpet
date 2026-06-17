/**
 * 时间引擎 —— 管理宠物离线时间流逝计算
 */

export interface TimeState {
  lastActiveTime: number;
}

const TICK_INTERVAL_MS = 1000; // 引擎 tick 间隔 1 秒

/**
 * 计算距离上次活跃的时间差（秒）
 */
export function getElapsedSeconds(lastActiveTime: number): number {
  return (Date.now() - lastActiveTime) / 1000;
}

/**
 * 计算距离上次活跃的时间差（毫秒）
 */
export function getElapsedMs(lastActiveTime: number): number {
  return Date.now() - lastActiveTime;
}

/**
 * 更新时间戳到当前
 */
export function refreshTimestamp(): number {
  return Date.now();
}

export { TICK_INTERVAL_MS };
