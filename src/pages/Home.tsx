import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page page-home">
      <div className="home-hero">
        <div className="home-mascot">🐣</div>
        <h1 className="home-title">WebPet</h1>
        <p className="home-subtitle">你的数字宠物伙伴</p>
        <p className="home-desc">"会饿、会困、会成长"的网页电子宠物</p>
      </div>

      <div className="home-nav">
        <Link to="/pet" className="home-btn home-btn-primary">
          🐾 进入养成
        </Link>
        <Link to="/garden" className="home-btn home-btn-secondary">
          🌸 宠物花园
        </Link>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <span className="feature-icon">🍖</span>
          <h3>喂养互动</h3>
          <p>喂食、哄睡、玩耍，照顾你的小宠物</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📈</span>
          <h3>状态成长</h3>
          <p>饥饿、精力、心情实时变化，见证成长</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🌟</span>
          <h3>进化系统</h3>
          <p>满足条件即可进化，解锁新形态</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💾</span>
          <h3>离线存档</h3>
          <p>本地自动保存，回来时状态依然延续</p>
        </div>
      </div>
    </div>
  );
}
