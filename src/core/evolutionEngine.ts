/**
 * 进化引擎 —— 根据宠物状态判断是否可以进化
 */

export interface EvolutionRequirement {
  level: number;
  name: string;
  emoji: string;
  condition: (state: EvolutionCheckState) => boolean;
}

interface EvolutionCheckState {
  level: number;
  happiness: number;
  age: number;
}

/**
 * 进化路线配置
 */
export const EVOLUTION_TREE: EvolutionRequirement[] = [
  {
    level: 1,
    name: '幼崽',
    emoji: '🐣',
    condition: () => true, // 初始状态
  },
  {
    level: 2,
    name: '活泼形态',
    emoji: '🐥',
    condition: (s) => s.level === 1 && s.happiness > 60,
  },
  {
    level: 3,
    name: '成熟形态',
    emoji: '🐔',
    condition: (s) => s.level === 2 && s.age > 3,
  },
  {
    level: 4,
    name: '发光进化形态',
    emoji: '🌟',
    condition: (s) => s.level === 3 && s.happiness > 90,
  },
];

/**
 * 获取当前等级对应的形态信息
 */
export function getCurrentEvolution(level: number): EvolutionRequirement {
  const idx = Math.min(level - 1, EVOLUTION_TREE.length - 1);
  return EVOLUTION_TREE[Math.max(0, idx)];
}

/**
 * 检查并返回可进化到的下一等级（-1 表示不可进化）
 */
export function checkEvolution(state: EvolutionCheckState): EvolutionRequirement | null {
  for (const evo of EVOLUTION_TREE) {
    if (evo.level > state.level && evo.condition(state)) {
      return evo;
    }
  }
  return null;
}
