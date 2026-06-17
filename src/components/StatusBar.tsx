import { usePetStore } from '../store/petStore';

interface BarProps {
  label: string;
  value: number;
  color: string;
  icon: string;
}

function Bar({ label, value, color, icon }: BarProps) {
  const getStatusText = (v: number) => {
    if (v > 70) return '良好';
    if (v > 30) return '普通';
    return '危险';
  };

  return (
    <div className="status-bar">
      <div className="status-bar-header">
        <span className="status-icon">{icon}</span>
        <span className="status-label">{label}</span>
        <span className={`status-text status-${value > 70 ? 'good' : value > 30 ? 'warn' : 'danger'}`}>
          {getStatusText(value)}
        </span>
      </div>
      <div className="status-bar-track">
        <div
          className="status-bar-fill"
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default function StatusBar() {
  const pet = usePetStore((s) => s.pet);

  return (
    <div className="status-bar-container">
      <Bar label="饥饿值" value={100 - pet.hunger} color="#FF8C42" icon="🍖" />
      <Bar label="精力值" value={pet.energy} color="#4ECDC4" icon="⚡" />
      <Bar label="心情值" value={pet.happiness} color="#FF6B9D" icon="💖" />
    </div>
  );
}
