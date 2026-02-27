'use server'

import { createServerClient } from '@/lib/supabase-server'
import { isEarlyBird, calculatePoints, getWeekStart } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function checkIn(userId: string) {
  const supabase = createServerClient()
  const now = new Date()
  const earlyBird = isEarlyBird(now)
  const points = calculatePoints(earlyBird)

  try {
    // Check if already checked in today
    const today = now.toISOString().split('T')[0]
    const { data: existingCheckIn } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('checked_in_at', `${today}T00:00:00`)
      .is('checked_out_at', null)
      .single()

    if (existingCheckIn) {
      return { error: '既にチェックイン済みです' }
    }

    // Insert check-in
    const { data: checkIn, error: checkInError } = await supabase
      .from('checkins')
      .insert({
        user_id: userId,
        checked_in_at: now.toISOString(),
        is_early_bird: earlyBird,
        points_earned: points,
      })
      .select()
      .single()

    if (checkInError) throw checkInError

    // Update weekly ranking
    const weekStart = getWeekStart(now)
    const { data: ranking } = await supabase
      .from('weekly_rankings')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStart)
      .single()

    if (ranking) {
      await supabase
        .from('weekly_rankings')
        .update({ total_points: ranking.total_points + points })
        .eq('id', ranking.id)
    } else {
      await supabase
        .from('weekly_rankings')
        .insert({
          user_id: userId,
          week_start: weekStart,
          total_points: points,
        })
    }

    // Check for badge achievements
    await checkBadgeAchievements(userId)

    revalidatePath('/demo')
    return { success: true, checkIn, points, earlyBird }
  } catch (error) {
    console.error('Check-in error:', error)
    return { error: 'チェックインに失敗しました' }
  }
}

export async function checkOut(userId: string) {
  const supabase = createServerClient()
  const now = new Date()

  try {
    // Find active check-in
    const { data: activeCheckIn } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .is('checked_out_at', null)
      .order('checked_in_at', { ascending: false })
      .limit(1)
      .single()

    if (!activeCheckIn) {
      return { error: 'アクティブなチェックインが見つかりません' }
    }

    // Update check-out time
    const { error: updateError } = await supabase
      .from('checkins')
      .update({ checked_out_at: now.toISOString() })
      .eq('id', activeCheckIn.id)

    if (updateError) throw updateError

    revalidatePath('/demo')
    return { success: true }
  } catch (error) {
    console.error('Check-out error:', error)
    return { error: 'チェックアウトに失敗しました' }
  }
}

export async function getActiveCheckIn(userId: string) {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .is('checked_out_at', null)
    .order('checked_in_at', { ascending: false })
    .limit(1)
    .single()

  return data
}

export async function getTodayCheckInCount() {
  const supabase = createServerClient()
  const today = new Date().toISOString().split('T')[0]

  const { count } = await supabase
    .from('checkins')
    .select('*', { count: 'exact', head: true })
    .gte('checked_in_at', `${today}T00:00:00`)
    .is('checked_out_at', null)

  return count || 0
}

async function checkBadgeAchievements(userId: string) {
  const supabase = createServerClient()

  // Check early bird badges
  const { data: recentCheckIns } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('is_early_bird', true)
    .order('checked_in_at', { ascending: false })
    .limit(14)

  if (!recentCheckIns) return

  // Check for consecutive early bird check-ins
  let consecutiveDays = 0
  const today = new Date()
  
  for (let i = 0; i < recentCheckIns.length; i++) {
    const checkInDate = new Date(recentCheckIns[i].checked_in_at)
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (checkInDate.toDateString() === expectedDate.toDateString()) {
      consecutiveDays++
    } else {
      break
    }
  }

  // Award badges based on consecutive days
  const badgesToAward = []
  if (consecutiveDays >= 3) badgesToAward.push('early_bird_bronze')
  if (consecutiveDays >= 7) badgesToAward.push('early_bird_silver')
  if (consecutiveDays >= 14) badgesToAward.push('early_bird_gold')

  for (const badgeType of badgesToAward) {
    const { data: existingBadge } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .single()

    if (!existingBadge) {
      await supabase
        .from('badges')
        .insert({
          user_id: userId,
          badge_type: badgeType,
        })
    }
  }

  // Check office guardian badge (100 hours)
  const { data: allCheckIns } = await supabase
    .from('checkins')
    .select('checked_in_at, checked_out_at')
    .eq('user_id', userId)
    .not('checked_out_at', 'is', null)

  if (allCheckIns) {
    let totalHours = 0
    for (const checkIn of allCheckIns) {
      const start = new Date(checkIn.checked_in_at)
      const end = new Date(checkIn.checked_out_at)
      totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }

    if (totalHours >= 100) {
      const { data: existingBadge } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_type', 'office_guardian')
        .single()

      if (!existingBadge) {
        await supabase
          .from('badges')
          .insert({
            user_id: userId,
            badge_type: 'office_guardian',
          })
      }
    }
  }
}
