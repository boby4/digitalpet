import { useState } from 'react';
import { usePetStore } from '../store/petStore';

const actions = [
  {
    key: 'feed',
    label: '喂食',
    icon: '🍖',
    color: '#FF8C42',
  },
  {
    key: 'sleep',
    label: '睡觉',
    icon: '😴',
    color: '#7C5CFF',
  },
  {
    key: 'play',
    label: '玩耍',
    icon: '🎾',
    color: '#FF6B9D',
  },
] as const;

export default function ActionPanel() {
  const { feedPet, sleepPet, playPet, resetPet } = usePetStore();
  const [cooldown, setCooldown] = useState<Record<string, boolean>>({});

  const handleAction = (key: string, fn: () => void) => {
    if (cooldown[key]) return;

    fn();
    setCooldown((prev) => ({ ...prev, [key]: true }));

    setTimeout(() => {
      setCooldown((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <div className="action-panel">
      {actions.map((action) => (
        <button
          key={action.key}
          className={`action-btn ${cooldown[action.key] ? 'action-btn-cooldown' : ''}`}
          style={{
            '--action-color': action.color,
          } as React.CSSProperties}
          onClick={() => handleAction(action.key, action.key === 'feed' ? feedPet : action.key === 'sleep' ? sleepPet : playPet)}
          disabled={cooldown[action.key]}
        >
          <span className="action-icon">{action.icon}</span>
          <span className="action-label">{action.label}</span>
        </button>
      ))}

      <button className="action-btn action-btn-reset" onClick={resetPet}>
        <span className="action-icon">🔄</span>
        <span className="action-label">重置</span>
      </button>
    </div>
  );
}
