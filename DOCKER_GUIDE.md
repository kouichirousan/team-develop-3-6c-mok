# 🐳 Docker セットアップガイド

## クイックスタート

### 開発モード（ホットリロード対応）

```bash
# 開発用コンテナを起動
docker-compose --profile dev up app-dev

# または、バックグラウンドで起動
docker-compose --profile dev up -d app-dev
```

ブラウザで http://localhost:3000/demo にアクセス

### 本番モード

```bash
# 本番用コンテナをビルド＆起動
docker-compose up --build

# または、バックグラウンドで起動
docker-compose up -d --build
```

## 📋 利用可能なコマンド

### コンテナの起動

```bash
# 開発モード（ホットリロード有効）
docker-compose --profile dev up app-dev

# 本番モード
docker-compose up app

# バックグラウンドで起動
docker-compose up -d app
```

### コンテナの停止

```bash
# すべてのコンテナを停止
docker-compose down

# コンテナとボリュームを削除
docker-compose down -v
```

### ログの確認

```bash
# リアルタイムでログを表示
docker-compose logs -f app

# 開発モードのログ
docker-compose logs -f app-dev
```

### コンテナ内でコマンド実行

```bash
# シェルに入る
docker-compose exec app sh

# npm コマンドを実行
docker-compose exec app npm run build
```

### イメージの再ビルド

```bash
# キャッシュを使わずに再ビルド
docker-compose build --no-cache

# 特定のサービスのみ再ビルド
docker-compose build app
```

## 🔧 環境変数の設定

### デモモードの場合

環境変数の設定は不要です。モックデータで動作します。

### Supabaseと連携する場合

1. `.env.docker` ファイルを編集：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. 環境変数を読み込んで起動：

```bash
# .env.dockerから環境変数を読み込む
export $(cat .env.docker | xargs)
docker-compose up --build
```

または、docker-compose.ymlで直接指定：

```yaml
environment:
  - NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📦 Docker構成の詳細

### Dockerfile（本番用）

- **マルチステージビルド**: イメージサイズを最小化
- **Node.js 20 Alpine**: 軽量なベースイメージ
- **Standalone出力**: Next.jsの最適化されたビルド
- **非rootユーザー**: セキュリティ強化

### Dockerfile.dev（開発用）

- **ホットリロード**: コード変更を即座に反映
- **ボリュームマウント**: ローカルファイルと同期
- **高速起動**: ビルドステップを省略

### docker-compose.yml

- **app**: 本番用サービス（デフォルト）
- **app-dev**: 開発用サービス（--profile dev で起動）
- **ネットワーク**: 将来的にデータベースなどを追加可能

## 🚀 デプロイ

### Docker Hubにプッシュ

```bash
# イメージをビルド
docker build -t your-username/office-vibe-connector:latest .

# Docker Hubにプッシュ
docker push your-username/office-vibe-connector:latest
```

### 本番サーバーで起動

```bash
# イメージをプル
docker pull your-username/office-vibe-connector:latest

# コンテナを起動
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  --name office-vibe \
  your-username/office-vibe-connector:latest
```

## 🔍 トラブルシューティング

### ポート3000が既に使用されている

```bash
# 別のポートにマッピング
docker-compose up app -p 3001:3000
```

または、docker-compose.ymlを編集：

```yaml
ports:
  - "3001:3000"
```

### node_modulesの問題

```bash
# ボリュームを削除して再ビルド
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### コンテナが起動しない

```bash
# ログを確認
docker-compose logs app

# コンテナの状態を確認
docker-compose ps
```

### メモリ不足

Docker Desktopの設定でメモリを増やす：
- Settings → Resources → Memory を 4GB以上に設定

## 📊 パフォーマンス

### イメージサイズ

- **本番イメージ**: 約150-200MB（Alpine + Standalone）
- **開発イメージ**: 約500-600MB（node_modules含む）

### 起動時間

- **本番モード**: 約5-10秒
- **開発モード**: 約15-30秒（初回ビルド）

## 🎯 次のステップ

1. **Nginx追加**: リバースプロキシとして配置
2. **PostgreSQL追加**: Supabaseの代わりにローカルDB
3. **Redis追加**: セッション管理やキャッシュ
4. **CI/CD**: GitHub Actionsで自動ビルド＆デプロイ

## 💡 ヒント

- 開発中は `app-dev` を使用してホットリロードを活用
- 本番デプロイ前に `app` で動作確認
- 環境変数は `.env.docker` で一元管理
- ログは `docker-compose logs -f` で常時監視
