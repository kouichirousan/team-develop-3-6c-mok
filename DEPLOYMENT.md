# 🚀 デプロイメントガイド

## 本番環境へのデプロイ手順

### 1. Supabaseプロジェクトのセットアップ

#### 1.1 プロジェクト作成
```bash
# Supabaseにアクセス
https://supabase.com/dashboard

# 新しいプロジェクトを作成
- Organization: 選択または作成
- Project name: office-vibe-connector
- Database password: 強力なパスワードを設定
- Region: 最寄りのリージョンを選択
```

#### 1.2 データベースマイグレーション
```bash
# SQL Editorを開く
# supabase/migrations/001_initial_schema.sql の内容をコピー＆実行

# または、Supabase CLIを使用
supabase link --project-ref your-project-ref
supabase db push
```

#### 1.3 認証設定
```bash
# Authentication > Providers
- Email: 有効化
- Confirm email: 本番環境では有効化推奨

# Authentication > URL Configuration
- Site URL: https://your-domain.com
- Redirect URLs: https://your-domain.com/**
```

### 2. Vercelへのデプロイ

#### 2.1 Vercelプロジェクト作成
```bash
# Vercelにログイン
https://vercel.com

# GitHubリポジトリをインポート
- Import Git Repository
- リポジトリを選択
```

#### 2.2 環境変数設定
```bash
# Settings > Environment Variables

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# すべての環境（Production, Preview, Development）に設定
```

#### 2.3 ビルド設定
```bash
# Build & Development Settings
Build Command: npm run build
Output Directory: .next
Install Command: npm install

# Node.js Version: 20.x
```

#### 2.4 デプロイ
```bash
# Deploy ボタンをクリック
# または、CLIを使用
vercel --prod
```

### 3. Dockerでのデプロイ

#### 3.1 本番用イメージビルド
```bash
# イメージをビルド
docker build -t office-vibe-connector:latest .

# Docker Hubにプッシュ
docker tag office-vibe-connector:latest your-username/office-vibe-connector:latest
docker push your-username/office-vibe-connector:latest
```

#### 3.2 サーバーで起動
```bash
# イメージをプル
docker pull your-username/office-vibe-connector:latest

# コンテナを起動
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  --name office-vibe \
  --restart unless-stopped \
  your-username/office-vibe-connector:latest
```

#### 3.3 Docker Composeでのデプロイ
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: your-username/office-vibe-connector:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    restart: unless-stopped
```

```bash
# 起動
docker-compose -f docker-compose.prod.yml up -d
```

### 4. AWS EC2へのデプロイ

#### 4.1 EC2インスタンス作成
```bash
# AMI: Ubuntu 22.04 LTS
# Instance Type: t3.small 以上
# Security Group: 
#   - SSH (22)
#   - HTTP (80)
#   - HTTPS (443)
#   - Custom TCP (3000) - 開発時のみ
```

#### 4.2 サーバーセットアップ
```bash
# SSH接続
ssh -i your-key.pem ubuntu@your-ec2-ip

# Node.js インストール
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker インストール（オプション）
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# プロジェクトクローン
git clone https://github.com/your-username/office-vibe-connector.git
cd office-vibe-connector

# 環境変数設定
nano .env.local
# NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定

# 依存関係インストール
npm install

# ビルド
npm run build

# PM2でプロセス管理
npm install -g pm2
pm2 start npm --name "office-vibe" -- start
pm2 save
pm2 startup
```

#### 4.3 Nginxリバースプロキシ設定
```bash
# Nginx インストール
sudo apt-get install nginx

# 設定ファイル作成
sudo nano /etc/nginx/sites-available/office-vibe

# 以下を追加
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 有効化
sudo ln -s /etc/nginx/sites-available/office-vibe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4.4 SSL証明書設定（Let's Encrypt）
```bash
# Certbot インストール
sudo apt-get install certbot python3-certbot-nginx

# SSL証明書取得
sudo certbot --nginx -d your-domain.com

# 自動更新設定
sudo certbot renew --dry-run
```

### 5. 環境変数チェックリスト

#### 必須
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### オプション
- `NODE_ENV=production`
- `PORT=3000`

### 6. デプロイ後の確認

#### 6.1 ヘルスチェック
```bash
# アプリケーションが起動しているか確認
curl http://your-domain.com

# データベース接続確認
# ブラウザで /demo にアクセス
```

#### 6.2 ログ確認
```bash
# Vercel
vercel logs

# Docker
docker logs office-vibe

# PM2
pm2 logs office-vibe
```

#### 6.3 パフォーマンステスト
```bash
# Lighthouse でスコア確認
# https://pagespeed.web.dev/

# 目標スコア:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 90+
```

### 7. CI/CD設定

#### 7.1 GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 8. モニタリング

#### 8.1 Vercel Analytics
```bash
# Vercel Dashboard > Analytics
- ページビュー
- ユニークビジター
- トップページ
```

#### 8.2 Supabase Monitoring
```bash
# Supabase Dashboard > Database
- アクティブ接続数
- クエリパフォーマンス
- ストレージ使用量
```

#### 8.3 エラートラッキング（Sentry）
```bash
# Sentryインストール
npm install @sentry/nextjs

# 設定
npx @sentry/wizard -i nextjs
```

### 9. バックアップ

#### 9.1 データベースバックアップ
```bash
# Supabase Dashboard > Database > Backups
- 自動バックアップ: 有効化
- 保持期間: 7日間以上

# 手動バックアップ
supabase db dump -f backup.sql
```

#### 9.2 コードバックアップ
```bash
# GitHubにプッシュ
git push origin main

# タグ作成
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

### 10. スケーリング

#### 10.1 Vercel
- 自動スケーリング（追加設定不要）
- Edge Functions で低レイテンシ

#### 10.2 Supabase
```bash
# Database > Settings
- Compute: 必要に応じてアップグレード
- Connection Pooling: 有効化
```

#### 10.3 CDN
```bash
# Vercel Edge Network（自動）
# または、Cloudflare を追加
```

### 11. セキュリティ

#### 11.1 環境変数の保護
- ✅ `.env.local` を `.gitignore` に追加
- ✅ Vercel/AWS Secrets Manager を使用
- ✅ 定期的にキーをローテーション

#### 11.2 HTTPS強制
```nginx
# Nginx設定
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

#### 11.3 セキュリティヘッダー
```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}
```

### 12. トラブルシューティング

#### ビルドエラー
```bash
# ローカルでビルドテスト
npm run build

# 依存関係の問題
rm -rf node_modules package-lock.json
npm install
```

#### データベース接続エラー
```bash
# 環境変数確認
echo $NEXT_PUBLIC_SUPABASE_URL

# Supabase接続テスト
curl https://your-project.supabase.co
```

#### パフォーマンス問題
```bash
# Next.js Bundle Analyzer
npm install @next/bundle-analyzer
# next.config.mjs に設定追加
```

## 🎉 デプロイ完了！

本番環境でOffice Vibe Connectorが稼働しています。
ユーザーにURLを共有して、オフィスの活性化を始めましょう！
