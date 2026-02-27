# 🚀 Office Vibe Connector

オフィスの雰囲気を可視化し、社員同士の交流を促進するゲーミフィケーションアプリ

## ✨ 主な機能

### 🏠 ホーム画面
- **リアルタイムVibeヒートマップ**: 現在のオフィスの活気を視覚化
- **ワンタップチェックイン**: 楽しいアニメーションとハプティクスフィードバック
- **今日のラッキーパーソン**: 趣味タグが一致する人をレコメンド
- **週間ランキング**: ポイント制でモチベーション向上

### 🏆 バッジ＆クエスト
- **早起き鳥** (Bronze/Silver/Gold): 連続早朝チェックインで進化
- **オフィスの守り人**: 滞在時間100時間突破
- **フードファイター**: 異なる部署の5人とランチで獲得

### 🗺️ オフィスマップ（実装予定）
- 座席予約システム
- リアルタイム在席状況
- ランキング上位者の特権席

### 📊 経営層ダッシュボード（実装予定）
- エリア別ヒートマップ
- タレントディスカバリー
- オフィス最適化提言

## 🛠️ 技術スタック

- **Frontend**: Next.js 14 (App Router), React 18
- **Styling**: Tailwind CSS (Neubrutalism Design)
- **Animation**: Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js Server Actions + API Routes
- **Language**: TypeScript
- **Deployment**: Vercel / Docker

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editorで `supabase/migrations/001_initial_schema.sql` を実行
3. プロジェクトのURLとAnon Keyを取得

詳細は [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) を参照

### 3. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` を編集：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000/demo を開く

## 🐳 Dockerでの起動

```bash
# 開発モード（ホットリロード有効）
docker-compose --profile dev up app-dev

# 本番モード
docker-compose up --build app
```

詳細は [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) を参照

## 🎮 デモモード

Supabaseの設定なしで、すぐに動作を確認できるデモモードを用意しています：

```bash
npm run dev
```

http://localhost:3000/demo にアクセス

### デモ機能

- **シミュレーションコントロール**: 時刻やオフィスの混雑状況を変更
- **リアルタイムチェックイン**: 早朝ボーナスの動作確認
- **バッジ獲得アニメーション**: 紙吹雪エフェクトと称号獲得モーダル
- **アクティビティログ**: すべてのアクションをリアルタイム表示
- **インタラクティブバッジ**: クリックで表示/非表示切替（最大3つ）

### シミュレーション操作

1. **早朝モード**: 時刻を7:30に変更して早起き鳥ボーナスを体験
2. **午後モード**: 通常時間帯のチェックインを体験
3. **混雑状態**: オフィスが熱気に包まれる様子を確認
4. **静かな状態**: 落ち着いたオフィスの雰囲気を確認

## 🎨 デザインコンセプト

### Neubrutalism
- 大胆な色使い（エレクトリック・ブルー、ネオン・イエロー）
- 太い境界線とシャドウ
- フラットでありながら立体感のあるUI

### マイクロインタラクション
- ボタンを押すと「ぷるん」と跳ねる
- 称号獲得時は紙吹雪アニメーション
- ハプティクスフィードバック

## 📊 データモデル

### User Profile
- 基本情報: ID, Name, Department, Role
- Vibeラベル: Work Style, Hobby Tags
- 統計: Check-in Count, Early Bird Points

### Check-in
- タイムスタンプ
- 早朝チェックインフラグ
- 獲得ポイント

### Badges
- バッジタイプ
- 獲得日時
- 表示設定

### Rankings
- 週次集計
- ポイント合計
- ランク

詳細は [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) を参照

## 🔧 バックエンドアーキテクチャ

### Server Actions
- チェックイン/アウト処理
- バッジ管理
- ランチマッチング
- ランキング計算
- プロフィール管理

### API Routes
- `/api/checkin` - チェックインAPI
- `/api/lunch` - ランチAPI
- `/api/ranking` - ランキングAPI
- `/api/profile` - プロフィールAPI

### 認証
- Supabase Auth
- Row Level Security (RLS)
- セッション管理

### データベース
- PostgreSQL (Supabase)
- トリガーによる自動統計更新
- インデックスによるパフォーマンス最適化

## 🚀 デプロイ

### Vercel
```bash
vercel --prod
```

### Docker
```bash
docker build -t office-vibe-connector .
docker run -p 3000:3000 office-vibe-connector
```

### AWS EC2
```bash
# PM2でプロセス管理
pm2 start npm --name "office-vibe" -- start
```

詳細は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照

## 🎯 今後の実装予定

- [x] 認証システム（Supabase Auth）
- [x] Server Actions（データ処理）
- [x] API Routes（RESTful API）
- [ ] リアルタイム通知（Supabase Realtime）
- [ ] プッシュ通知
- [ ] モバイルアプリ（React Native）
- [ ] 分析ダッシュボード拡張
- [ ] エクスポート機能（CSV、PDF）

## 📚 ドキュメント

- [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) - バックエンド実装の詳細
- [DEPLOYMENT.md](./DEPLOYMENT.md) - デプロイメント手順
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Docker完全ガイド
- [DEMO_GUIDE.md](./DEMO_GUIDE.md) - デモの使い方
- [NAVIGATION_GUIDE.md](./NAVIGATION_GUIDE.md) - ページ構造とナビゲーション

## 🤝 コントリビューション

プルリクエスト歓迎！バグ報告や機能提案はIssueでお願いします。

## 📄 ライセンス

MIT
