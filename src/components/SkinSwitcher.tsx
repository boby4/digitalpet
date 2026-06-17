import { useState } from 'react';
import { usePetStore } from '../store/petStore';
import { EVOLUTION_TREE, getCurrentEvolution } from '../core/evolutionEngine';

export default function SkinSwitcher() {
  const pet = usePetStore((s) => s.pet);
  const skinLevel = usePetStore((s) => s.skinLevel);
  const setSkinLevel = usePetStore((s) => s.setSkinLevel);
  const [toast, setToast] = useState('');
  const userLevel = pet.level;

  // 当用户等级为 1 时，只有一个形态无需显示切换器
  if (userLevel <= 1) return null;

  const currentSkin = getCurrentEvolution(skinLevel);

  const handleSwitch = (level: number) => {
    if (level === skinLevel) return;
    const evo = getCurrentEvolution(level);
    setSkinLevel(level);
    setToast(`已切换至 ${evo.emoji} ${evo.name}`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="skin-switcher">
      <div className="skin-switcher-label">
        当前外观：<strong>{currentSkin.emoji} {currentSkin.name}</strong>
      </div>
      <div className="skin-switcher-list">
        {EVOLUTION_TREE.filter((evo) => evo.level <= userLevel).map((evo) => {
          const isActive = evo.level === skinLevel;
          return (
            <button
              key={evo.level}
              className={`skin-btn ${isActive ? 'skin-btn-active' : ''}`}
              onClick={() => handleSwitch(evo.level)}
              title={evo.name}
            >
              <span className="skin-btn-emoji">{evo.emoji}</span>
              <span className="skin-btn-label">Lv.{evo.level}</span>
              {isActive && <span className="skin-btn-check">✓</span>}
            </button>
          );
        })}
      </div>
      {toast && <div className="skin-switcher-toast">{toast}</div>}
    </div>
  );
}
