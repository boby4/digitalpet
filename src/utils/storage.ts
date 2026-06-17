import type { PetState } from '../core/petEngine';

const STORAGE_KEY = 'webpet_save';

export function savePet(pet: PetState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  } catch {
    console.warn('Failed to save pet data to localStorage');
  }
}

export function loadPet(): PetState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    // 基础校验
    if (typeof parsed.hunger !== 'number') return null;
    return parsed as PetState;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(STORAGE_KEY);
}
