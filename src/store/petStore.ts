import { create } from 'zustand';
import {
  type PetState,
  createDefaultPetState,
  applyTimeDecay,
  feed,
  sleep,
  play,
  incrementAge,
} from '../core/petEngine';
import type { EvolutionRequirement } from '../core/evolutionEngine';
import { checkEvolution, getCurrentEvolution } from '../core/evolutionEngine';
import { savePet, loadPet } from '../utils/storage';
import { getElapsedSeconds } from '../core/timeEngine';
import { isNewDay } from '../utils/time';

/** 模块级：上次跨天检查点 */
let lastDayCheck = Date.now();

interface PetStore {
  // 状态
  pet: PetState;
  skinLevel: number;                  // 当前显示外观等级（可切换已解锁形态）
  currentEvolution: EvolutionRequirement;
  evolvingTo: EvolutionRequirement | null;
  showEvolution: boolean;
  message: string;
  clickMessage: string;              // 戳宠物时的气泡消息

  // 动作
  initialize: () => void;
  feedPet: () => void;
  sleepPet: () => void;
  playPet: () => void;
  tick: () => void;
  dismissEvolution: () => void;
  setSkinLevel: (level: number) => void;
  setClickMessage: (msg: string) => void;
  resetPet: () => void;
}

export const usePetStore = create<PetStore>((set, get) => ({
  pet: createDefaultPetState(),
  skinLevel: 1,
  currentEvolution: getCurrentEvolution(1),
  evolvingTo: null,
  showEvolution: false,
  message: '',
  clickMessage: '',

  initialize: () => {
    const saved = loadPet();
    let pet: PetState;

    if (saved) {
      // 先保存旧时间戳，applyTimeDecay 会原地修改 lastActiveTime
      const oldLastActiveTime = saved.lastActiveTime;
      const elapsedMs = getElapsedSeconds(oldLastActiveTime) * 1000;
      pet = applyTimeDecay({ ...saved }, elapsedMs);

      // 检查是否跨天，增加年龄
      if (isNewDay(oldLastActiveTime)) {
        const daysPassed = Math.max(1, Math.floor(
          (Date.now() - oldLastActiveTime) / (1000 * 60 * 60 * 24),
        ));
        incrementAge(pet, daysPassed);
      }

      lastDayCheck = Date.now();

      const elapsedMinutes = Math.round((Date.now() - oldLastActiveTime) / 60000);
      const msg = elapsedMinutes > 0
        ? `欢迎回来！你离开了 ${elapsedMinutes} 分钟`
        : '欢迎回来！';

      const evolution = checkEvolution(pet);
      set({
        pet,
        skinLevel: pet.level,
        currentEvolution: getCurrentEvolution(pet.level),
        evolvingTo: evolution,
        showEvolution: evolution !== null,
        message: msg,
      });
    } else {
      pet = createDefaultPetState();
      set({
        pet,
        skinLevel: 1,
        currentEvolution: getCurrentEvolution(1),
        evolvingTo: null,
        showEvolution: false,
        message: '一只小宠物出现了！好好照顾它吧 🐣',
      });
    }

    savePet(pet);
  },

  feedPet: () => {
    const { pet } = get();
    const updated = feed({ ...pet });
    const evolution = checkEvolution(updated);

    set({
      pet: updated,
      currentEvolution: getCurrentEvolution(updated.level),
      evolvingTo: evolution,
      showEvolution: evolution !== null,
      message: '吃得好饱～ 谢谢！🍖',
    });
    savePet(updated);
  },

  sleepPet: () => {
    const { pet } = get();
    const updated = sleep({ ...pet });
    const evolution = checkEvolution(updated);

    set({
      pet: updated,
      currentEvolution: getCurrentEvolution(updated.level),
      evolvingTo: evolution,
      showEvolution: evolution !== null,
      message: '做了一个好梦... Zzz... 🌙',
    });
    savePet(updated);
  },

  playPet: () => {
    const { pet } = get();
    const updated = play({ ...pet });
    const evolution = checkEvolution(updated);

    set({
      pet: updated,
      currentEvolution: getCurrentEvolution(updated.level),
      evolvingTo: evolution,
      showEvolution: evolution !== null,
      message: '太好玩了！再来一次！🎾',
    });
    savePet(updated);
  },

  tick: () => {
    const { pet, showEvolution } = get();
    // 进化动画显示时不更新状态（避免弹窗闪烁）
    if (showEvolution) return;

    // 每秒 tick，更新 1 秒的时间衰减
    const updated = applyTimeDecay({ ...pet }, 1000);

    // 检查是否跨天（在线挂机过夜）
    if (isNewDay(lastDayCheck)) {
      incrementAge(updated, 1);
      lastDayCheck = Date.now();
    }

    const evolution = checkEvolution(updated);

    set({
      pet: updated,
      currentEvolution: getCurrentEvolution(updated.level),
      evolvingTo: evolution,
      showEvolution: evolution !== null,
    });
    // 每 10 秒存档一次
    if (Math.floor(Date.now() / 1000) % 10 === 0) {
      savePet(updated);
    }
  },

  dismissEvolution: () => {
    const { evolvingTo, pet } = get();
    if (evolvingTo) {
      // 真正升级
      const updated = { ...pet, level: evolvingTo.level };
      set({
        pet: updated,
        skinLevel: updated.level,
        currentEvolution: getCurrentEvolution(updated.level),
        evolvingTo: null,
        showEvolution: false,
      });
      savePet(updated);
    } else {
      set({ showEvolution: false, evolvingTo: null });
    }
  },

  setSkinLevel: (level: number) => {
    const { pet, skinLevel } = get();
    if (level >= 1 && level <= pet.level && level !== skinLevel) {
      set({ skinLevel: level });
    }
  },

  setClickMessage: (msg: string) => {
    set({ clickMessage: msg });
  },

  resetPet: () => {
    lastDayCheck = Date.now();
    const pet = createDefaultPetState();
    set({
      pet,
      skinLevel: 1,
      currentEvolution: getCurrentEvolution(1),
      evolvingTo: null,
      showEvolution: false,
      message: '新的小宠物诞生了！好好照顾它吧 🐣',
    });
    savePet(pet);
  },
}));
