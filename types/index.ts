export type Role = 'General' | 'Manager' | 'Executive'

export type BadgeType = 
  | 'early_bird_bronze'
  | 'early_bird_silver'
  | 'early_bird_gold'
  | 'office_guardian'
  | 'food_fighter'

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

export interface LunchLog {
  id: string
  requester_id: string
  partner_id: string
  lunch_date: string
  status: 'pending' | 'accepted' | 'completed' | 'rejected'
  created_at: string
}

export interface Badge {
  id: string
  user_id: string
  badge_type: BadgeType
  earned_at: string
  is_displayed: boolean
}

export interface Ranking {
  user_id: string
  name: string
  department: string
  total_points: number
  rank: number
  badge_count: number
}
