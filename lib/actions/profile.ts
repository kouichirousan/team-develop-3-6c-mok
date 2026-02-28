'use server'

import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { Role } from '@/types'

export async function getUserProfile(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string
    department?: string
  }
) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/demo/settings')
    revalidatePath('/demo')
    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { error: 'プロフィール更新に失敗しました' }
  }
}

export async function createUserProfile(data: {
  id: string
  name: string
  department: string
  role: Role
}) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase
      .from('user_profiles')
      .insert(data)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error creating profile:', error)
    return { error: 'プロフィール作成に失敗しました' }
  }
}

export async function getUserStats(userId: string) {
  const supabase = createServerClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('checkin_count, early_bird_points')
    .eq('id', userId)
    .single()

  const { count: badgeCount } = await supabase
    .from('badges')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { data: ranking } = await supabase
    .from('weekly_rankings')
    .select('total_points, rank')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(1)
    .single()

  return {
    checkin_count: profile?.checkin_count || 0,
    early_bird_points: profile?.early_bird_points || 0,
    badge_count: badgeCount || 0,
    total_points: ranking?.total_points || 0,
    rank: ranking?.rank || null,
  }
}

export async function getAllUsers(excludeUserId?: string) {
  const supabase = createServerClient()

  let query = supabase
    .from('user_profiles')
    .select('*')
    .order('name')

  if (excludeUserId) {
    query = query.neq('id', excludeUserId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data
}
