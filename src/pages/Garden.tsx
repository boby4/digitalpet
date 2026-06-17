import { Link } from 'react-router-dom';
import { usePetStore } from '../store/petStore';
import { EVOLUTION_TREE } from '../core/evolutionEngine';

/** 邻居宠物（纯展示 NPC） */
const NEIGHBOR_PETS = [
  { id: 1, name: '小美', emoji: '🐕', hint: '阳光开朗的狗狗' },
  { id: 2, name: '老白', emoji: '🐢', hint: '智慧又沉稳' },
];

/**
 * 获取进化到该等级所需的条件和当前进度
 * 返回 { label, current, target } 或 null（已是最高等级）
 */
function getEvoProgress(
  evoLevel: number,
  userLevel: number,
  pet: { happiness: number; age: number },
): { label: string; current: number; target: number; pct: number } | null {
  const isLocked = userLevel < evoLevel;
  // Lv.1 初始就是，不算需要解锁的
  if (evoLevel <= 1) return null;
  // Lv.4 是最高等级，没有下一级
  if (evoLevel === 4 && userLevel >= 4) return null;
  // 还没解锁（超过用户等级太多），不显示进度
  if (isLocked && evoLevel > userLevel + 1) return null;

  switch (evoLevel) {
    case 2: {
      // Lv1→Lv2：心情 > 60
      const target = 60;
      return {
        label: '心情值',
        current: Math.min(pet.happiness, target),
        target,
        pct: Math.min(pet.happiness / target, 1),
      };
    }
    case 3: {
      // Lv2→Lv3：年龄 > 3
      const target = 3;
      return {
        label: '成长天数',
        current: Math.min(pet.age, target),
        target,
        pct: Math.min(pet.age / target, 1),
      };
    }
    case 4: {
      // Lv3→Lv4：心情 > 90
      const target = 90;
      return {
        label: '心情值',
        current: Math.min(pet.happiness, target),
        target,
        pct: Math.min(pet.happiness / target, 1),
      };
    }
    default:
      return null;
  }
}

export default function Garden() {
  const pet = usePetStore((s) => s.pet);
  const skinLevel = usePetStore((s) => s.skinLevel);
  const setSkinLevel = usePetStore((s) => s.setSkinLevel);
  const userLevel = pet.level;

  return (
    <div className="page page-garden">
      <header className="garden-header">
        <Link to="/" className="garden-back-btn">← 首页</Link>
        <h1 className="garden-title">🌸 宠物花园</h1>
        <Link to="/pet" className="garden-pet-btn">🐾 我的宠物</Link>
      </header>

      {/* ===== 进化形态收藏 ===== */}
      <section className="garden-section">
        <h2 className="garden-section-title">进化形态收藏</h2>
        <p className="garden-section-desc">点击已解锁的形态来切换宠物外观</p>

        <div className="garden-grid">
          {EVOLUTION_TREE.map((evo) => {
            const unlocked = userLevel >= evo.level;
            const active = skinLevel === evo.level;
            const progress = getEvoProgress(evo.level, userLevel, pet);
            const isNext = evo.level === userLevel + 1;

            return (
              <div
                key={evo.level}
                className={[
                  'garden-card',
                  unlocked ? 'garden-card-unlocked' : '',
                  active ? 'garden-card-active' : '',
                ].join(' ')}
                onClick={() => unlocked && setSkinLevel(evo.level)}
                style={unlocked ? { cursor: 'pointer' } : { cursor: 'default' }}
              >
                <div className="garden-card-pet">
                  <span
                    className="garden-pet-emoji"
                    style={unlocked ? {} : { filter: 'grayscale(1) opacity(0.5)' }}
                  >
                    {evo.emoji}
                  </span>
                </div>
                <div className="garden-card-info">
                  <h3>
                    {evo.name}
                    {active && <span className="garden-tag-active">使用中</span>}
                    {!unlocked && <span className="garden-tag-locked">未解锁</span>}
                    {unlocked && !active && <span className="garden-tag-done">已解锁</span>}
                  </h3>
                  <p className="garden-card-status">Lv.{evo.level}</p>

                  {/* 进度条：可解锁的下一级 或 当前级但不是最高级 */}
                  {progress && (evo.level === userLevel || isNext) && (
                    <div className="evo-progress">
                      <div className="evo-progress-label">
                        {progress.label} {progress.current}/{progress.target}
                      </div>
                      <div className="evo-progress-track">
                        <div
                          className="evo-progress-fill"
                          style={{ width: `${progress.pct * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!progress && !unlocked && evo.level < userLevel + 1 && (
                    <p className="garden-card-hint">已解锁，需进化到此等级</p>
                  )}
                  {!progress && unlocked && !active && (
                    <p className="garden-card-hint">点击切换到此形态</p>
                  )}
                  {!progress && active && evo.level === 4 && (
                    <p className="garden-card-hint">最终形态 🏆</p>
                  )}
                </div>
                {!unlocked && <span className="garden-card-locked">🔒</span>}
                {active && <span className="garden-card-active-badge">⭐</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 邻居宠物 ===== */}
      <section className="garden-section">
        <h2 className="garden-section-title">邻居的宠物</h2>
        <p className="garden-section-desc">花园里的其他小伙伴</p>

        <div className="garden-grid">
          {NEIGHBOR_PETS.map((np) => (
            <div key={np.id} className="garden-card garden-card-neighbor">
              <div className="garden-card-pet">
                <span className="garden-pet-emoji">{np.emoji}</span>
              </div>
              <div className="garden-card-info">
                <h3>{np.name}</h3>
                <p className="garden-card-hint">{np.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="garden-footer">更多功能和互动即将上线...</p>
    </div>
  );
}
