# 🌊 彦田ブルー（仮名前）

スマートフォン向けオフィス可視化モックアップアプリ

## ✨ 概要

オフィスの雰囲気を可視化し、社員同士の交流を促進するモバイルファーストのモックアップアプリです。  
バックエンド不要で、フロントエンドのみで動作します。

## 📱 主な画面

### 🏠 ホーム
- Ocean Vibe ヒートマップ（出社人数の可視化）
- ワンタップチェックイン/アウト

### 🗺️ マップ
- 部署別の在席メンバー一覧
- エリア別坪単価検索

### 🏆 バッジ
- バッジコレクション（獲得/未獲得の表示）
- 進捗バー

### 🍽️ ランチ
- ランチマッチング（招待/参加）
- 部署を超えた交流促進

### ⚙️ 設定
- プロフィール設定
- 通知設定

### 📊 経営ダッシュボード（管理者のみ）
- 出社率グラフ
- 部署別統計

### 🏢 オフィス設定（管理者のみ）
- 部署管理
- オフィス情報設定

### 💰 コストシミュレーション（管理者のみ）
- AI最適化提案
- コスト分析

## 🛠️ 技術スタック

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript
- **Styling**: Tailwind CSS (Ocean Theme)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Date**: date-fns

## 🚀 起動方法

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 📂 プロジェクト構成

```
app/
├── page.tsx              # ルート（/loginへリダイレクト）
├── login/                # ログイン画面
├── register/             # 新規登録画面
└── demo/                 # メイン画面群
    ├── page.tsx           # ホーム
    ├── map/               # マップ
    ├── badges/            # バッジ
    ├── lunch/             # ランチ
    ├── settings/          # 設定
    ├── executive/         # 経営ダッシュボード
    ├── office-settings/   # オフィス設定
    └── cost-simulation/   # コストシミュレーション
components/
├── BottomNav.tsx          # モバイル下部ナビゲーション
├── CheckInButton.tsx      # チェックインボタン
├── OceanVibeHeatmap.tsx   # ヒートマップ
└── BadgeCard.tsx          # バッジカード
```

## 🎨 デザイン

- **テーマ**: Ocean（海をモチーフにした配色）
- **レイアウト**: モバイルファースト（max-w-lg）
- **ナビゲーション**: 下部タブバー（BottomNav）
- **UIスタイル**: Neubrutalism（太い境界線・シャドウ）

## 📄 ライセンス

MIT
