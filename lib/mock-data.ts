import type { UserProfile, Ranking } from '@/types'

export const mockUsers: UserProfile[] = [
  {
    id: 'user-1',
    name: '田中太郎',
    department: '開発部',
    role: 'General',
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
    checkin_count: 50,
    early_bird_points: 20,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-02-27T00:00:00Z',
  },
]

export function getRandomUser(excludeId?: string): UserProfile {
  const available = mockUsers.filter(u => u.id !== excludeId)
  return available[Math.floor(Math.random() * available.length)]
}
