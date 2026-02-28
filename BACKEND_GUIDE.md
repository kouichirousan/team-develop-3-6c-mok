# 🔧 バックエンド実装ガイド

## 概要

Office Vibe Connectorのバックエンドは以下の技術で構築されています：

- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **API**: Next.js App Router (Server Actions + API Routes)
- **リアルタイム**: Supabase Realtime (オプション)

## 📁 ディレクトリ構造

```
lib/
├── actions/          # Server Actions
│   ├── checkin.ts    # チェックイン/アウト処理
│   ├── badges.ts     # バッジ管理
│   ├── lunch.ts      # ランチマッチング
│   ├── ranking.ts    # ランキング処理
│   └── profile.ts    # プロフィール管理
├── supabase.ts       # クライアントサイドSupabase
├── supabase-server.ts # サーバーサイドSupabase
├── auth.ts           # 認証ヘルパー
└── utils.ts          # ユーティリティ関数

app/api/              # API Routes
├── checkin/route.ts  # チェックインAPI
├── lunch/route.ts    # ランチAPI
├── ranking/route.ts  # ランキングAPI
└── profile/route.ts  # プロフィールAPI

hooks/                # カスタムフック
├── useCheckin.ts     # チェックイン機能
└── useLunch.ts       # ランチ機能

contexts/             # React Context
└── AuthContext.tsx   # 認証コンテキスト
```

## 🗄️ データベースセットアップ

### 1. Supabaseプロジェクト作成

1. [Supabase](https://supabase.com)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトURLとAnon Keyを取得

### 2. 環境変数設定

`.env.local` を作成：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. マイグレーション実行

Supabase SQL Editorで `supabase/migrations/001_initial_schema.sql` を実行

または、Supabase CLIを使用：

```bash
supabase db push
```

## 🔐 認証システム

### AuthContext

全アプリケーションで認証状態を管理：

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, profile, signIn, signOut } = useAuth()
  
  // user: Supabase User オブジェクト
  // profile: UserProfile データ
}
```

### 認証フロー

1. **サインアップ**
   - メール/パスワードで登録
   - user_profiles テーブルに自動作成

2. **サインイン**
   - メール/パスワードで認証
   - プロフィール情報を自動取得

3. **セッション管理**
   - Supabase Authが自動管理
   - トークンリフレッシュも自動

## 📡 Server Actions

### チェックイン処理

```typescript
import { checkIn, checkOut } from '@/lib/actions/checkin'

// チェックイン
const result = await checkIn(userId)
// { success: true, checkIn, points, earlyBird }

// チェックアウト
const result = await checkOut(userId)
// { success: true }
```

### バッジ管理

```typescript
import { getUserBadges, toggleBadgeDisplay } from '@/lib/actions/badges'

// バッジ取得
const badges = await getUserBadges(userId)

// 表示切替
await toggleBadgeDisplay(userId, badgeId, true)
```

### ランチマッチング

```typescript
import { sendLunchInvitation, respondToLunchInvitation } from '@/lib/actions/lunch'

// 招待送信
await sendLunchInvitation(requesterId, partnerId, '2024-03-01')

// 招待への返信
await respondToLunchInvitation(invitationId, userId, true)
```

## 🌐 API Routes

### チェックインAPI

```typescript
// POST /api/checkin
{
  "userId": "uuid",
  "action": "check-in" | "check-out"
}

// GET /api/checkin?userId=uuid
// Returns: { activeCheckIn }
```

### ランチAPI

```typescript
// POST /api/lunch
{
  "action": "invite",
  "userId": "uuid",
  "partnerId": "uuid",
  "lunchDate": "2024-03-01"
}

// GET /api/lunch?userId=uuid&type=pending|history|progress
```

### ランキングAPI

```typescript
// GET /api/ranking
// Returns: { rankings: Ranking[] }

// GET /api/ranking?userId=uuid
// Returns: { ranking: Ranking }
```

## 🎣 カスタムフック

### useCheckin

```typescript
import { useCheckin } from '@/hooks/useCheckin'

function CheckInButton() {
  const { checkIn, checkOut, loading, error } = useCheckin()
  
  const handleCheckIn = async () => {
    const result = await checkIn()
    if (result.earlyBird) {
      // 早朝ボーナス処理
    }
  }
}
```

### useLunch

```typescript
import { useLunch } from '@/hooks/useLunch'

function LunchPage() {
  const {
    sendInvitation,
    respondToInvitation,
    pendingInvitations,
    lunchHistory,
    progress,
  } = useLunch()
}
```

## 🔄 データフロー

### チェックインフロー

```
1. ユーザーがチェックインボタンをクリック
   ↓
2. useCheckin.checkIn() を呼び出し
   ↓
3. /api/checkin にPOSTリクエスト
   ↓
4. Server Action: checkIn(userId)
   ↓
5. データベースに記録
   - checkins テーブルに挿入
   - user_profiles の統計更新（トリガー）
   - weekly_rankings にポイント追加
   ↓
6. バッジ達成チェック
   ↓
7. レスポンス返却
   ↓
8. UIを更新（ポイント、バッジなど）
```

### バッジ獲得フロー

```
1. チェックイン完了
   ↓
2. checkBadgeAchievements() 実行
   ↓
3. 条件チェック
   - 早起き鳥: 連続日数
   - オフィスの守り人: 累計滞在時間
   - フードファイター: 異部署ランチ数
   ↓
4. 条件達成時、badges テーブルに挿入
   ↓
5. 通知表示（フロントエンド）
```

## 🔒 セキュリティ

### Row Level Security (RLS)

すべてのテーブルでRLSを有効化：

```sql
-- ユーザーは自分のデータのみ更新可能
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- ランチログは関係者のみ閲覧可能
CREATE POLICY "Users can view lunch logs they're involved in" ON lunch_logs
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = partner_id);
```

### 認証チェック

Server Actionsで自動的にユーザー認証を確認：

```typescript
export async function checkIn(userId: string) {
  const supabase = createServerClient()
  // Supabaseが自動的に認証チェック
  // RLSポリシーが適用される
}
```

## 📊 パフォーマンス最適化

### インデックス

頻繁にクエリされるカラムにインデックスを作成：

```sql
CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_date ON checkins(checked_in_at);
```

### キャッシング

Next.jsの `revalidatePath` でキャッシュを管理：

```typescript
import { revalidatePath } from 'next/cache'

export async function checkIn(userId: string) {
  // ... データベース処理
  revalidatePath('/demo')  // キャッシュを無効化
}
```

## 🧪 テスト

### Server Actionsのテスト

```typescript
import { checkIn } from '@/lib/actions/checkin'

describe('checkIn', () => {
  it('should create check-in record', async () => {
    const result = await checkIn('test-user-id')
    expect(result.success).toBe(true)
  })
})
```

## 🚀 デプロイ

### 環境変数

本番環境で以下を設定：

```
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```

### データベースマイグレーション

```bash
# 本番環境にマイグレーション適用
supabase db push --db-url your_production_db_url
```

## 📝 今後の拡張

- [ ] リアルタイム通知（Supabase Realtime）
- [ ] Webhooks（外部サービス連携）
- [ ] バッチ処理（週次ランキングリセット）
- [ ] 分析ダッシュボード（経営層向け）
- [ ] エクスポート機能（CSV、PDF）

## 🆘 トラブルシューティング

### データベース接続エラー

```
Error: Invalid Supabase URL
```

→ `.env.local` の設定を確認

### RLSポリシーエラー

```
Error: new row violates row-level security policy
```

→ 認証状態を確認、ポリシーを見直し

### マイグレーションエラー

```
Error: relation already exists
```

→ `DROP TABLE IF EXISTS` を使用、または既存テーブルを削除

## 📚 参考資料

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
