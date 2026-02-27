'use server'

import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { BadgeType } from '@/types'

export async function getUserBadges(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })

  if (error) {
    console.error('Error fetching badges:', error)
    return []
  }

  return data
}

export async function toggleBadgeDisplay(userId: string, badgeId: string, isDisplayed: boolean) {
  const supabase = createServerClient()

  try {
    // If setting to displayed, check current displayed count
    if (isDisplayed) {
      const { count } = await supabase
        .from('badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_displayed', true)

      if (count && count >= 3) {
        return { error: '最大3つまでしか表示できません' }
      }
    }

    const { error } = await supabase
      .from('badges')
      .update({ is_displayed: isDisplayed })
      .eq('id', badgeId)
      .eq('user_id', userId)

    if (error) throw error

    revalidatePath('/demo/badges')
    return { success: true }
  } catch (error) {
    console.error('Error toggling badge display:', error)
    return { error: 'バッジ表示の切り替えに失敗しました' }
  }
}

export async function getDisplayedBadges(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .eq('is_displayed', true)
    .limit(3)

  if (error) {
    console.error('Error fetching displayed badges:', error)
    return []
  }

  return data
}

export async function getBadgeProgress(userId: string) {
  const supabase = createServerClient()

  const allBadgeTypes: BadgeType[] = [
    'early_bird_bronze',
    'early_bird_silver',
    'early_bird_gold',
    'office_guardian',
    'food_fighter',
  ]

  const { data: earnedBadges } = await supabase
    .from('badges')
    .select('badge_type')
    .eq('user_id', userId)

  const earnedTypes = earnedBadges?.map(b => b.badge_type) || []

  return {
    total: allBadgeTypes.length,
    earned: earnedTypes.length,
    earnedTypes,
    progress: (earnedTypes.length / allBadgeTypes.length) * 100,
  }
}
