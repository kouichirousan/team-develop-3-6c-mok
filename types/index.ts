export type Role = 'General' | 'Manager' | 'Executive'

export interface UserProfile {
  id: string
  name: string
  department: string
  role: Role
  checkin_count: number
  early_bird_points: number
  created_at: string
  updated_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  checked_in_at: string
  checked_out_at: string | null
  is_early_bird: boolean
  points_earned: number
}

export interface Ranking {
  user_id: string
  name: string
  department: string
  total_points: number
  rank: number
}
