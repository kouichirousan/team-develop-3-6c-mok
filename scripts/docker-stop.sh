#!/bin/bash

echo "🛑 Office Vibe Connector - Docker停止スクリプト"
echo ""

# 停止オプション選択
echo "停止方法を選択してください："
echo "1) コンテナを停止"
echo "2) コンテナを停止してボリュームも削除"
echo ""
read -p "選択 (1 or 2): " mode

case $mode in
  1)
    echo ""
    echo "コンテナを停止します..."
    docker-compose down
    echo "✅ 停止完了"
    ;;
  2)
    echo ""
    echo "コンテナとボリュームを削除します..."
    docker-compose down -v
    echo "✅ 削除完了"
    ;;
  *)
    echo "無効な選択です。1 または 2 を入力してください。"
    exit 1
    ;;
esac
