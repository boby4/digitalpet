import { useEffect, useState } from 'react';
import { usePetStore } from '../store/petStore';
import { randomPick } from '../utils/random';

const hungryMessages = ['好饿啊... 🍖', '有没有吃的？', '肚子在咕咕叫...'];
const tiredMessages = ['好困... 😴', '眼睛睁不开了...', '想睡觉了 Zzz'];
const happyMessages = ['今天真开心！😆', '最喜欢和你一起玩！', '嘻嘻～'];
const normalMessages = ['今天天气真好 ☀️', '嗯？什么事？', '发发呆...'];
const sadMessages = ['有点难过... 😢', '没人陪我...', '好无聊啊...'];

function getMessage(hunger: number, energy: number, happiness: number): string {
  if (hunger > 70) return randomPick(hungryMessages);
  if (energy < 30) return randomPick(tiredMessages);
  if (happiness > 70) return randomPick(happyMessages);
  if (happiness < 30) return randomPick(sadMessages);
  return randomPick(normalMessages);
}

export default function EmotionBubble() {
  const pet = usePetStore((s) => s.pet);
  const message = usePetStore((s) => s.message);
  const clickMessage = usePetStore((s) => s.clickMessage);
  const [bubbleMsg, setBubbleMsg] = useState('');

  useEffect(() => {
    // 初始显示
    setBubbleMsg(getMessage(pet.hunger, pet.energy, pet.happiness));

    // 每 8 秒随机更新气泡
    const interval = setInterval(() => {
      setBubbleMsg(getMessage(pet.hunger, pet.energy, pet.happiness));
    }, 8000);

    return () => clearInterval(interval);
  }, [pet.hunger, pet.energy, pet.happiness]);

  // 优先级：clickMessage > message > bubbleMsg
  const flash = !!(clickMessage || message);
  const displayMsg = clickMessage || message || bubbleMsg;

  return (
    <div className={`emotion-bubble ${flash ? 'emotion-bubble-flash' : ''}`}>
      <span>{displayMsg}</span>
    </div>
  );
}
