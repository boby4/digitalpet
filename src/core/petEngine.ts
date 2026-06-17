/**
 * 宠物状态引擎 —— 管理所有状态数值变化
 */

export interface PetState {
  hunger: number;       // 饥饿值 0~100（0=饱腹，100=极度饥饿）
  energy: number;       // 精力值 0~100（0=疲惫，100=精力充沛）
  happiness: number;    // 心情值 0~100（0=沮丧，100=开心）
  age: number;          // 成长天数
  level: number;        // 当前等级
  lastActiveTime: number; // 最后活跃时间戳
}

/** 创建一个默认的初始宠物状态 */
export function createDefaultPetState(): PetState {
  return {
    hunger: 30,
    energy: 80,
    happiness: 60,
    age: 0,
    level: 1,
    lastActiveTime: Date.now(),
  };
}

/** 限制数值在 0~100 范围内 */
function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 时间流逝 —— 根据离线时间更新饥饿和精力
 * @param state 当前宠物状态
 * @param elapsedMs 流逝的毫秒数
 */
export function applyTimeDecay(state: PetState, elapsedMs: number): PetState {
  if (elapsedMs <= 0) return state;

  const seconds = elapsedMs / 1000;

  // 每 10 秒饥饿 +1
  state.hunger = clamp(state.hunger + seconds * 0.1);
  // 每 15 秒精力 -1
  state.energy = clamp(state.energy - seconds * 0.067);

  // 饥饿过高时心情持续下降
  if (state.hunger > 80) {
    state.happiness = clamp(state.happiness - seconds * 0.05);
  }

  // 精力过低时心情也会下降
  if (state.energy < 20) {
    state.happiness = clamp(state.happiness - seconds * 0.03);
  }

  state.lastActiveTime = Date.now();
  return state;
}

/** 喂食：降低饥饿、提升心情 */
export function feed(state: PetState): PetState {
  state.hunger = clamp(state.hunger - 25);
  state.happiness = clamp(state.happiness + 10);
  state.lastActiveTime = Date.now();
  return state;
}

/** 睡眠：恢复精力 */
export function sleep(state: PetState): PetState {
  state.energy = clamp(state.energy + 40);
  state.hunger = clamp(state.hunger + 5); // 睡醒会饿
  state.lastActiveTime = Date.now();
  return state;
}

/** 互动/玩耍：提升心情，消耗少量精力 */
export function play(state: PetState): PetState {
  state.happiness = clamp(state.happiness + 20);
  state.energy = clamp(state.energy - 10);
  state.lastActiveTime = Date.now();
  return state;
}

/** 增加年龄（每天 +1） */
export function incrementAge(state: PetState, days = 1): PetState {
  state.age += days;
  return state;
}
