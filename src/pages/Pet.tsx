import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePetStore } from '../store/petStore';
import { getCurrentEvolution } from '../core/evolutionEngine';
import PetView from '../components/PetView';
import StatusBar from '../components/StatusBar';
import ActionPanel from '../components/ActionPanel';
import EmotionBubble from '../components/EmotionBubble';
import EvolutionView from '../components/EvolutionView';
import SkinSwitcher from '../components/SkinSwitcher';

export default function Pet() {
  const initialize = usePetStore((s) => s.initialize);
  const tick = usePetStore((s) => s.tick);
  const pet = usePetStore((s) => s.pet);
  const skinLevel = usePetStore((s) => s.skinLevel);
  const skinEvo = getCurrentEvolution(skinLevel);

  // 初始化：加载存档 + 时间衰减
  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 实时 tick：每秒更新状态
  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="page page-pet">
      <header className="pet-header">
        <Link to="/" className="pet-back-btn">← 首页</Link>
        <div className="pet-header-info">
          <span className="pet-header-emoji">{skinEvo.emoji}</span>
          <span className="pet-header-title">WebPet</span>
          <span className="pet-header-level">Lv.{pet.level}</span>
          <span className="pet-header-age">Day {pet.age}</span>
        </div>
        <Link to="/garden" className="pet-garden-btn">🌸 花园</Link>
      </header>

      <div className="pet-main">
        <EmotionBubble />
        <PetView />
        <StatusBar />
        <ActionPanel />
        <SkinSwitcher />
      </div>

      <EvolutionView />
    </div>
  );
}
