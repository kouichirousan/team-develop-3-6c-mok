import type { UserProfile, Ranking, BadgeType, LunchLog } from '@/types'

export const mockUsers: UserProfile[] = [
  {
    id: 'user-1',
    name: '田中太郎',
    department: '開発部',
    role: 'General',
    work_style: '集中モード',
    hobby_tags: ['サウナ', '筋トレ', '投資'],
    checkin_count: 45,
    early_bird_points: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-27T00:00:00Z',
  },
  {
    id: 'user-2',
    name: '佐藤花子',
    department: 'デザイン部',
    role: 'Manager',
    work_style: '雑談OK',
    hobby_tags: ['サウナ', 'アニメ', 'キャンプ'],
    checkin_count: 38,
    early_bird_points: 8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-27T00:00:00Z',
  },
  {
    id: 'user-3',
    name: '鈴木一郎',
    department: '営業部',
    role: 'General',
    work_style: '相談のります',
    hobby_tags: ['激辛', '投資'],
    checkin_count: 32,
    early_bird_points: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-27T00:00:00Z',
  },
  {
    id: 'user-4',
    name: '高橋美咲',
    department: 'マーケティング部',
    role: 'General',
    work_style: '雑談OK',
    hobby_tags: ['キャンプ', 'アニメ'],
    checkin_count: 28,
    early_bird_points: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-27T00:00:00Z',
  },
  {
    id: 'user-5',
    name: '山田健太',
    department: '開発部',
    role: 'Executive',
    work_style: '相談のります',
    hobby_tags: ['筋トレ', '投資', 'サウナ'],
    checkin_count: 50,
    early_bird_points: 20,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-27T00:00:00Z',
  },
]

export const mockUserBadges: Record<string, BadgeType[]> = {
  'user-1': ['early_bird_bronze', 'early_bird_silver', 'office_guardian'],
  'user-2': ['early_bird_bronze', 'food_fighter'],
  'user-5': ['early_bird_bronze', 'early_bird_silver', 'early_bird_gold', 'office_guardian', 'food_fighter'],
}

export const mockLunchLogs: LunchLog[] = [
  {
    id: 'lunch-1',
    requester_id: 'user-1',
    partner_id: 'user-2',
    lunch_date: '2024-02-26',
    status: 'completed',
    created_at: '2024-02-26T10:00:00Z',
  },
  {
    id: 'lunch-2',
    requester_id: 'user-1',
    partner_id: 'user-3',
    lunch_date: '2024-02-25',
    status: 'completed',
    created_at: '2024-02-25T10:00:00Z',
  },
]

export function getRandomUser(excludeId?: string): UserProfile {
  const available = mockUsers.filter(u => u.id !== excludeId)
  return available[Math.floor(Math.random() * available.length)]
}

export function findMatchingUsers(userId: string): UserProfile[] {
  const user = mockUsers.find(u => u.id === userId)
  if (!user) return []
  
  return mockUsers
    .filter(u => u.id !== userId)
    .filter(u => u.hobby_tags.some(tag => user.hobby_tags.includes(tag)))
    .slice(0, 3)
}
