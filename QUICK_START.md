# 🚀 クイックスタートガイド

## Dockerで今すぐ起動！

### 1. 開発モード（推奨）

```bash
docker-compose --profile dev up app-dev
```

### 2. ブラウザで開く

```
http://localhost:3000/demo
```

### 3. デモを楽しむ！

- 🌅 早朝モードボタンをクリック
- ✅ チェックインボタンを押す
- 🎉 紙吹雪とバッジ獲得を体験
- 🔥 オフィスの混雑状態を変更
- 🏆 バッジをクリックして表示切替

## 停止方法

```bash
# Ctrl+C で停止
# または別のターミナルで
docker-compose down
```

## その他のコマンド

```bash
# バックグラウンドで起動
docker-compose --profile dev up -d app-dev

# ログを確認
docker-compose logs -f app-dev

# 本番モードで起動
docker-compose up --build app
```

## トラブルシューティング

### ポート3000が使用中の場合

docker-compose.ymlを編集：

```yaml
ports:
  - "3001:3000"  # 3001に変更
```

### コンテナが起動しない

```bash
# すべてクリーンアップして再起動
docker-compose down -v
docker-compose --profile dev up --build app-dev
```

## 詳細ドキュメント

- [DEMO_GUIDE.md](./DEMO_GUIDE.md) - デモの詳細な使い方
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Docker完全ガイド
- [README.md](./README.md) - プロジェクト全体の説明

## 🎮 デモで体験できること

✅ リアルタイムチェックイン/アウト
✅ 早起き鳥ボーナス（紙吹雪エフェクト）
✅ バッジ獲得アニメーション
✅ オフィスVibeヒートマップ
✅ 週間ランキング
✅ ラッキーパーソンレコメンド
✅ アクティビティログ
✅ インタラクティブバッジコレクション

楽しんでください！🎉
