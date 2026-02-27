#!/bin/bash

echo "🗄️ Office Vibe Connector - データベースセットアップ"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLIがインストールされていません"
    echo "インストール方法: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "✅ Supabase CLI が見つかりました"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local ファイルが見つかりません"
    echo "以下の内容で .env.local を作成してください："
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo ""
    read -p ".env.local を作成しましたか？ (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        exit 1
    fi
fi

echo "📋 マイグレーションファイルを確認中..."
if [ ! -f supabase/migrations/001_initial_schema.sql ]; then
    echo "❌ マイグレーションファイルが見つかりません"
    exit 1
fi

echo "✅ マイグレーションファイルが見つかりました"
echo ""

echo "🚀 データベースのセットアップ方法："
echo ""
echo "1. Supabaseプロジェクトにログイン"
echo "   https://supabase.com/dashboard"
echo ""
echo "2. SQL Editorを開く"
echo ""
echo "3. 以下のファイルの内容をコピー＆実行："
echo "   supabase/migrations/001_initial_schema.sql"
echo ""
echo "または、Supabase CLIを使用："
echo "   supabase db push"
echo ""

read -p "セットアップを続けますか？ (y/n): " continue
if [ "$continue" != "y" ]; then
    exit 0
fi

echo ""
echo "✅ セットアップ完了！"
echo ""
echo "次のステップ："
echo "1. npm install でパッケージをインストール"
echo "2. npm run dev で開発サーバーを起動"
echo "3. http://localhost:3000/demo にアクセス"
echo ""
