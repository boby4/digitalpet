# 🐣 WebPet — 数字宠物养成系统

一个"会饿、会困、会成长"的网页电子宠物系统，基于 React + TypeScript + Vite 构建。

## 快速开始

```bash
npm install
npm run dev      # 开发模式 → http://localhost:5173
npm run build    # 生产构建 → dist/
```

## 项目结构

```
src/
├── core/                         # 核心引擎
│   ├── petEngine.ts              #   状态变化：喂食/睡觉/玩耍/时间衰减
│   ├── evolutionEngine.ts        #   进化路线：Lv1→Lv4 四阶段
│   └── timeEngine.ts             #   时间流逝计算
│
├── store/
│   └── petStore.ts               #   Zustand 全局状态 + LocalStorage 自动存档
│
├── components/
│   ├── PetView.tsx               #   Canvas 绘制宠物（rAF 动画循环）
│   ├── StatusBar.tsx             #   饥饿/精力/心情 进度条
│   ├── ActionPanel.tsx           #   喂食/睡觉/玩耍 操作按钮
│   ├── EmotionBubble.tsx         #   情绪对话气泡
│   ├── EvolutionView.tsx         #   进化动画遮罩（Framer Motion）
│   └── SkinSwitcher.tsx          #   皮肤快速切换器
│
├── pages/
│   ├── Home.tsx                  #   首页（宠物漂浮 + 功能卡片）
│   ├── Pet.tsx                   #   主养成页
│   └── Garden.tsx                #   宠物花园（形态收藏 + 进度条 + NPC）
│
├── utils/
│   ├── storage.ts                #   LocalStorage 存档读写
│   ├── random.ts                 #   随机工具
│   └── time.ts                   #   时间/跨天判断
│
├── App.tsx                       #   路由（react-router-dom）
└── main.tsx
```

## 核心玩法

### 宠物状态

| 属性 | 范围 | 说明 |
|------|------|------|
| 饥饿值 `hunger` | 0~100 | 随时间上升，过高影响心情 |
| 精力值 `energy` | 0~100 | 随时间下降，过低影响心情 |
| 心情值 `happiness` | 0~100 | 影响宠物表情和进化 |
| 年龄 `age` | 天数 | 每跨一次午夜 +1 |
| 等级 `level` | 1~4 | 决定进化阶段 |

### 操作

| 操作 | 效果 |
|------|------|
| 🍖 喂食 | 饥饿 -25，心情 +10 |
| 😴 睡觉 | 精力 +40，饥饿 +5 |
| 🎾 玩耍 | 心情 +20，精力 -10 |

### 进化路线

```
Lv.1 幼崽  ──[心情>60]──▶  Lv.2 活泼形态
Lv.2 活泼  ──[年龄>3]──▶  Lv.3 成熟形态
Lv.3 成熟  ──[心情>90]──▶  Lv.4 发光进化形态
```

### Canvas 宠物交互

- **闲置呼吸**：持续微浮动
- **自动眨眼**：每约 3 秒一次
- **点击弹跳**：物理弹跳 + 爱心粒子特效
- **点击气泡**：随机可爱对话反馈
- **皮肤切换**：花园解锁形态后可自由切换外观

### 皮肤装饰

| 等级 | 特色 |
|------|------|
| Lv.1 | 基础幼崽外观 |
| Lv.2 | 头顶皇冠 👑 |
| Lv.3 | 蓝色翅膀 🦋 |
| Lv.4 | 金色光环 + 漂浮闪光 ✦ |

## 数据持久化

- 使用 `localStorage` 自动存档（每 10 秒保存）
- 离线回来自动计算时间衰减 + 跨天年龄增长
- 花园皮肤选择随存档保留

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite |
| 状态管理 | Zustand |
| 路由 | react-router-dom |
| 动画 | Framer Motion + Canvas requestAnimationFrame |
| 存储 | LocalStorage |

## 部署

```bash
npm run build   # 输出到 dist/
```

将 `dist/` 部署到任意静态托管：

- **Vercel**：Build `npm run build`，Output `dist`
- **Netlify**：拖拽 `dist/` 文件夹
- **GitHub Pages**：配置 actions 自动部署 `dist/`
