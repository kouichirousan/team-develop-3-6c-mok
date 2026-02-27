#!/bin/bash

echo "🐳 Office Vibe Connector - Docker起動スクリプト"
echo ""

# 環境選択
echo "起動モードを選択してください："
echo "1) 開発モード（ホットリロード有効）"
echo "2) 本番モード"
echo ""
read -p "選択 (1 or 2): " mode

case $mode in
  1)
    echo ""
    echo "🔧 開発モードで起動します..."
    echo "ホットリロードが有効です。コード変更は自動的に反映されます。"
    echo ""
    docker-compose --profile dev up app-dev
    ;;
  2)
    echo ""
    echo "🚀 本番モードで起動します..."
    echo "最適化されたビルドを使用します。"
    echo ""
    docker-compose up --build app
    ;;
  *)
    echo "無効な選択です。1 または 2 を入力してください。"
    exit 1
    ;;
esac
