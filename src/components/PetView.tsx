import { useRef, useEffect, useCallback } from 'react';
import { usePetStore } from '../store/petStore';
import type { PetState } from '../core/petEngine';
import { randomPick } from '../utils/random';

/* ===== 粒子 ===== */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  emoji: string;
  size: number;
}

let particles: Particle[] = [];

function spawnParticles(cx: number, cy: number) {
  const emojis = ['💕', '💖', '✨', '🌟', '💫', '🌸'];
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 2.5;
    particles.push({
      x: cx + (Math.random() - 0.5) * 50,
      y: cy + (Math.random() - 0.5) * 30,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 0,
      maxLife: 35 + Math.random() * 35,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: 12 + Math.random() * 8,
    });
  }
}

function updateParticles(ctx: CanvasRenderingContext2D) {
  particles = particles.filter((p) => p.life < p.maxLife);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life++;
    const alpha = 1 - p.life / p.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `${p.size}px sans-serif`;
    ctx.fillText(p.emoji, p.x, p.y);
    ctx.restore();
  }
}

/* ===== 点击消息 ===== */
const CLICK_MESSAGES = [
  '嘻嘻～别戳了！😆', '好痒好痒！', '呀！吓我一跳！',
  '再戳一下嘛～', '嘿嘿，好开心 💕', '你真好！',
  '要抱抱！', '啵唧～💖', '最喜欢你了！',
];

/* ===== 皮肤色表 ===== */
const SKIN_COLORS: Record<number, { body: string; belly: string; ear: string }> = {
  1: { body: '#F5D5A0', belly: '#FFF5E6', ear: '#E8C080' },
  2: { body: '#F8C8A0', belly: '#FFF0E0', ear: '#E8A870' },
  3: { body: '#F0B8C0', belly: '#FFF0F0', ear: '#E898A0' },
  4: { body: '#D8C0F0', belly: '#F8F0FF', ear: '#C0A0E0' },
};

function getColors(skin: number) {
  return SKIN_COLORS[skin] ?? SKIN_COLORS[1];
}

/** 皮肤装饰 */
function getDecor(skin: number) {
  return {
    crown: skin >= 2,
    wings: skin >= 3,
    halo: skin >= 4,
  };
}

/* ===== 绘制 ===== */
function drawPet(
  ctx: CanvasRenderingContext2D,
  pet: PetState,
  skin: number,
  size: number,
  bounceY: number,
  frame: number,
) {
  const cx = size / 2;
  const cy = size / 2 + 20 + bounceY;
  ctx.clearRect(0, 0, size, size);

  const mood = pet.happiness > 70 ? 'happy' : pet.happiness > 30 ? 'neutral' : 'sad';
  const hungry = pet.hunger > 70;
  const tired = pet.energy < 30;
  const colors = getColors(skin);
  const decor = getDecor(skin);
  const blink = frame % 180 > 170;

  // === 翅膀 ===
  if (decor.wings) {
    const flap = Math.sin(frame * 0.05) * 4;
    ctx.save();
    ctx.fillStyle = 'rgba(180,200,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(cx - 42, cy + 5, 18, 9, 0.5, 0, Math.PI * 2);
    ctx.transform(1, 0, -Math.sin(flap * 0.1) * 0.1, 1, 0, 0);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = 'rgba(180,200,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(cx + 42, cy + 5, 18, 9, -0.5, 0, Math.PI * 2);
    ctx.transform(1, 0, -Math.sin(-flap * 0.1) * 0.1, 1, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  // === 光环 ===
  if (decor.halo) {
    const haloY = cy - 42;
    ctx.beginPath();
    ctx.ellipse(cx, haloY, 22, 6, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,215,0,0.6)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // === 身体（圆润的大椭圆） ===
  ctx.beginPath();
  ctx.ellipse(cx, cy + 15, 38, 42, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.body;
  ctx.fill();

  // 肚皮
  ctx.beginPath();
  ctx.ellipse(cx, cy + 22, 22, 28, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.belly;
  ctx.fill();

  // === 耳朵 ===
  const earWobble = Math.sin(frame * 0.04) * 1;
  // 左耳
  ctx.beginPath();
  ctx.ellipse(cx - 22, cy - 30, 12, 18, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = colors.body;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - 22, cy - 28, 6, 11, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = colors.ear;
  ctx.fill();
  // 右耳
  ctx.beginPath();
  ctx.ellipse(cx + 22, cy - 30, 12, 18, 0.2 + earWobble * 0.02, 0, Math.PI * 2);
  ctx.fillStyle = colors.body;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 22, cy - 28, 6, 11, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = colors.ear;
  ctx.fill();

  // === 眼睛 ===
  const eyeY = cy - 5;
  if (tired || blink) {
    // 闭眼
    ctx.beginPath();
    ctx.moveTo(cx - 18, eyeY);
    ctx.lineTo(cx - 6, eyeY);
    ctx.moveTo(cx + 6, eyeY);
    ctx.lineTo(cx + 18, eyeY);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.lineCap = 'butt';
  } else {
    // 大圆眼
    ctx.beginPath();
    ctx.ellipse(cx - 12, eyeY, 6.5, mood === 'sad' ? 5 : 8, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 12, eyeY, 6.5, mood === 'sad' ? 5 : 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    // 大高光
    ctx.beginPath();
    ctx.arc(cx - 10, eyeY - 3, 3.2, 0, Math.PI * 2);
    ctx.arc(cx + 14, eyeY - 3, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    // 小高光
    ctx.beginPath();
    ctx.arc(cx - 14, eyeY + 1, 1.5, 0, Math.PI * 2);
    ctx.arc(cx + 10, eyeY + 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // === 嘴巴 ===
  const mouthY = cy + 5;
  ctx.beginPath();
  if (mood === 'happy') {
    ctx.arc(cx, mouthY, 7, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    // 舌头
    ctx.beginPath();
    ctx.ellipse(cx, mouthY + 4, 4, 3, 0, 0, Math.PI);
    ctx.fillStyle = '#FF8888';
    ctx.fill();
  } else if (mood === 'sad') {
    ctx.arc(cx, mouthY + 8, 7, Math.PI + 0.3, -0.3);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.8;
    ctx.stroke();
  } else {
    ctx.moveTo(cx - 5, mouthY + 3);
    ctx.quadraticCurveTo(cx, mouthY + 1, cx + 5, mouthY + 3);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // === 红晕（始终有，心情好更深） ===
  const blushAlpha = mood === 'happy' ? 0.45 : 0.2;
  ctx.beginPath();
  ctx.ellipse(cx - 20, cy + 2, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 20, cy + 2, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,150,150,${blushAlpha})`;
  ctx.fill();

  // === 小手 ===
  ctx.beginPath();
  ctx.ellipse(cx - 28, cy + 35, 10, 9, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 28, cy + 35, 10, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.body;
  ctx.fill();

  // === 小脚 ===
  ctx.beginPath();
  ctx.ellipse(cx - 14, cy + 50, 9, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 14, cy + 50, 9, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.ear;
  ctx.fill();

  // === 小尾巴 ===
  ctx.beginPath();
  ctx.ellipse(cx + 32, cy + 40, 7, 5, Math.PI * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = colors.body;
  ctx.fill();

  // === 皇冠 ===
  if (decor.crown) {
    const crownY = cy - 50;
    ctx.beginPath();
    ctx.moveTo(cx - 10, crownY + 8);
    ctx.lineTo(cx - 9, crownY - 1);
    ctx.lineTo(cx - 3, crownY + 3);
    ctx.lineTo(cx, crownY - 4);
    ctx.lineTo(cx + 3, crownY + 3);
    ctx.lineTo(cx + 9, crownY - 1);
    ctx.lineTo(cx + 10, crownY + 8);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // === 饥饿标记 ===
  if (hungry && !tired) {
    ctx.font = '14px sans-serif';
    ctx.fillText('💭', cx + 38, cy - 48);
  }

  // === Lv.4 闪光 ===
  if (decor.halo) {
    const t = frame * 0.05;
    const sparkleY = cy - 50;
    ctx.font = '12px sans-serif';
    ctx.fillText('✦', cx - 28, sparkleY + Math.sin(t) * 5);
    ctx.fillText('✦', cx + 22, sparkleY + Math.cos(t * 1.3) * 5);
  }

  // === 粒子 ===
  updateParticles(ctx);
}

/* ===== 组件 ===== */
export default function PetView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef({ bounce: 0, bounceV: 0, frame: 0 });
  const pet = usePetStore((s) => s.pet);
  const skinLevel = usePetStore((s) => s.skinLevel);
  const setClickMessage = usePetStore((s) => s.setClickMessage);
  const size = 200;

  const handleClick = useCallback(() => {
    const a = animRef.current;
    a.bounceV = 5;
    spawnParticles(size / 2, size / 2 + 20);
    setClickMessage(randomPick(CLICK_MESSAGES));
    // 2.5s 后清除气泡消息
    setTimeout(() => setClickMessage(''), 2500);
  }, [size, setClickMessage]);

  useEffect(() => {
    let rafId = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const a = animRef.current;
      a.frame++;

      // --- 弹跳物理（修复抖动） ---
      if (a.bounce < -0.5) a.bounceV += 0.5;
      a.bounce += a.bounceV;
      a.bounceV -= 0.35;
      // 接近 0 时吸附，消除微小振荡
      if (a.bounce >= -0.3 && a.bounceV >= -0.4) {
        a.bounce = 0;
        a.bounceV = 0;
      }
      // 限制最大下压
      if (a.bounce < -14) { a.bounce = -14; a.bounceV = 0; }

      // 闲置呼吸（超慢）
      const idleBob = Math.sin(a.frame * 0.025) * 2.5;
      const bounceY = a.bounce + idleBob;

      drawPet(ctx, pet, skinLevel, size, bounceY, a.frame);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [pet, skinLevel, size]);

  return (
    <div
      className="pet-view pet-view-clickable"
      onClick={handleClick}
      title="戳戳小宠物~"
    >
      <canvas ref={canvasRef} width={size} height={size} className="pet-canvas" />
    </div>
  );
}
