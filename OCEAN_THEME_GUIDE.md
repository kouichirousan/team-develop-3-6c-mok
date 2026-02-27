# 🌊 Ocean Theme Design Guide

## デザインコンセプト

Office Vibe Connectorは「海」をテーマにしたデザインを採用しています。
オフィスを海に見立て、社員を魚に例えることで、自然で心地よい雰囲気を演出します。

## 🎨 カラーパレット

### 海の深さを表現

```css
ocean: {
  deep: '#003D5C',      /* 深海 - ダークブルー */
  medium: '#0077BE',    /* 中層 - ミディアムブルー */
  light: '#4FC3F7',     /* 浅瀬 - ライトブルー */
  surface: '#B3E5FC',   /* 水面 - ペールブルー */
}
```

### アクセントカラー

```css
accent: '#FFD700',      /* 太陽の光 - ゴールド */
coral: {
  pink: '#FF6B9D',      /* サンゴピンク */
  orange: '#FF8C42',    /* サンゴオレンジ */
}
sand: '#F5DEB3',        /* 砂浜 - ベージュ */
```

## 🐠 魚のアニメーション

### コンセプト
出社人数 = 泳いでいる魚の数

```
2人出社 → 🐠🐟 2匹の魚が泳ぐ
10人出社 → 🐠🐟🐡🦈🐙... 10匹の魚が泳ぐ
50人出社 → 海が魚でいっぱい！
```

### 魚の種類
- 🐠 熱帯魚（一般社員）
- 🐟 青い魚（一般社員）
- 🐡 フグ（特別な日）
- 🦈 サメ（マネージャー）
- 🐙 タコ（エグゼクティブ）

### アニメーション
```typescript
// 泳ぐアニメーション
animate={{
  x: [0, 30, 0, -20, 0],
  y: [0, -15, -5, -20, 0],
}}
transition={{
  duration: 3-5秒（ランダム）,
  repeat: Infinity,
  ease: "easeInOut"
}}
```

## 🫧 泡のエフェクト

### 泡の動き
```typescript
// 下から上に浮かぶ
animate={{ 
  y: -400,
  opacity: [0, 1, 1, 0],
  scale: [0, 1, 1, 0.5]
}}
```

### 配置
- ランダムなX座標
- 画面下部から生成
- 4-6秒で消える

## 🌊 波のエフェクト

### 水面の波
```css
/* 波形のクリップパス */
clip-path: polygon(
  0 0, 100% 0, 100% 50%, 
  90% 60%, 80% 50%, 70% 60%, 
  60% 50%, 50% 60%, 40% 50%, 
  30% 60%, 20% 50%, 10% 60%, 
  0 50%
)
```

### アニメーション
```typescript
animate={{ x: [0, 20, 0] }}
transition={{ duration: 3, repeat: Infinity }}
```

## 🏖️ 海底の装飾

### 要素
- 🪸 サンゴ
- 🐚 貝殻
- ⭐ ヒトデ

### 配置
```typescript
<div className="absolute bottom-2 left-0 right-0 flex justify-around">
  <span>🪸</span>
  <span>🐚</span>
  <span>⭐</span>
  <span>🪸</span>
  <span>🐚</span>
</div>
```

## 📊 深さによる表現

### オフィスの活気度

```typescript
// 70%以上: 深海（活気あり）
from-ocean-deep to-ocean-medium
text: '🌊 オフィスが活気に満ちています！'

// 40-70%: 中層（いい感じ）
from-ocean-medium to-ocean-light
text: '🐠 いい感じの賑わいです'

// 40%未満: 浅瀬（静か）
from-ocean-light to-ocean-surface
text: '🐟 静かな海のようです'
```

## 🎭 UI要素のスタイル

### ボタン
```css
/* チェックインボタン */
bg-gradient-to-br from-accent to-coral-orange
border-4 border-ocean-deep
shadow-[8px_8px_0px_0px_rgba(0,61,92,0.8)]
text-white
```

### カード
```css
/* 白いカード（半透明） */
bg-white/90 backdrop-blur-sm
border-4 border-ocean-deep
shadow-[4px_4px_0px_0px_rgba(0,61,92,0.3)]
```

### サイドバー
```css
/* グラデーション背景 */
bg-gradient-to-b from-white to-ocean-surface/20
backdrop-blur-sm
border-r-4 border-ocean-deep
```

## 🌈 グラデーション使用例

### 背景
```css
/* 全体の背景 */
bg-gradient-to-b from-ocean-surface via-ocean-light to-ocean-medium

/* 光の効果 */
radial-gradient(
  circle at 20% 50%, 
  rgba(255, 255, 255, 0.1) 0%, 
  transparent 50%
)
```

### ボタン
```css
/* プライマリボタン */
bg-gradient-to-br from-ocean-medium to-ocean-deep
hover:from-ocean-light hover:to-ocean-medium

/* アクセントボタン */
bg-gradient-to-br from-accent to-coral-orange
hover:from-coral-orange hover:to-accent
```

## 🎨 バッジカラー

### 早起き鳥シリーズ
```css
Bronze: bg-gradient-to-br from-amber-600 to-amber-800
Silver: bg-gradient-to-br from-gray-400 to-gray-600
Gold: bg-gradient-to-br from-yellow-400 to-yellow-600
```

### 特別バッジ
```css
オフィスの守り人: bg-gradient-to-br from-ocean-medium to-ocean-deep
フードファイター: bg-gradient-to-br from-coral-pink to-coral-orange
```

## 🔤 タイポグラフィ

### テキストシャドウ
```css
/* 白いテキスト */
drop-shadow-lg
text-white

/* 海の色のテキスト */
text-ocean-deep
```

## 🎬 アニメーション一覧

### 魚の泳ぎ
```css
@keyframes swim {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(20px) translateY(-10px); }
}
```

### 波の動き
```css
@keyframes wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 泡の浮上
```css
@keyframes bubble {
  0% { transform: translateY(0) scale(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(-100px) scale(1); opacity: 0; }
}
```

## 📱 レスポンシブデザイン

### モバイル
- 魚のサイズを小さく
- 泡の数を減らす
- アニメーションを軽量化

### デスクトップ
- 魚のサイズを大きく
- 泡の数を増やす
- リッチなアニメーション

## 🎯 デザイン原則

1. **自然な動き**: 魚や泡は自然な動きを心がける
2. **パフォーマンス**: アニメーションは60fps維持
3. **アクセシビリティ**: 色だけに頼らない情報伝達
4. **一貫性**: 海のテーマを全ページで統一

## 💡 実装のヒント

### パフォーマンス最適化
```typescript
// 魚の数を制限
const maxFish = Math.min(checkedInCount, 30)

// アニメーションの間引き
const shouldAnimate = checkedInCount < 20
```

### アクセシビリティ
```typescript
// 動きを減らす設定に対応
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (prefersReducedMotion) {
  // アニメーションを無効化
}
```

## 🎨 カスタマイズ

### 季節による変更
```typescript
// 夏: 明るい色
// 冬: 深い色
const seasonalColors = {
  summer: 'from-ocean-light to-ocean-surface',
  winter: 'from-ocean-deep to-ocean-medium'
}
```

### イベント時
```typescript
// 特別な日は特別な魚
const specialFish = ['🐬', '🐳', '🦑']
```

## 🌟 まとめ

Office Vibe Connectorの海のテーマは：
- 🌊 視覚的に心地よい
- 🐠 直感的に理解しやすい
- 🎨 ブランドアイデンティティを確立
- 💙 リラックスした雰囲気を演出

海をテーマにすることで、オフィスという「堅い」イメージを
「自由で楽しい」空間に変えることができます。
