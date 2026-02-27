'use server'

import { createServerClient } from '@/lib/supabase-server'
import { getWeekStart } from '@/lib/utils'
import type { Ranking } from '@/types'

export async function getWeeklyRankings(weekStart?: string): Promise<Ranking[]> {
  const supabase = createServerClient()
  const week = weekStart || getWeekStart()

  const { data: rankings, error } = await supabase
    .from('weekly_rankings')
    .select(`
      *,
      user_profiles (
        name,
        department
      )
    `)
    .eq('week_start', week)
    .order('total_points', { ascending: false })

  if (error) {
    console.error('Error fetching rankings:', error)
    return []
  }

  // Get badge counts for each user
  const rankingsWithBadges = await Promise.all(
    rankings.map(async (ranking, index) => {
      const { count } = await supabase
        .from('badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', ranking.user_id)

      return {
        user_id: ranking.user_id,
        name: ranking.user_profiles?.name || 'Unknown',
        department: ranking.user_profiles?.department || 'Unknown',
        total_points: ranking.total_points,
        rank: index + 1,
        badge_count: count || 0,
      }
    })
  )

  // Update ranks in database
  for (const ranking of rankingsWithBadges) {
    await supabase
      .from('weekly_rankings')
      .update({ rank: ranking.rank })
      .eq('user_id', ranking.user_id)
      .eq('week_start', week)
  }

  return rankingsWithBadges
}

export async function getUserRanking(userId: string, weekStart?: string) {
  const rankings = await getWeeklyRankings(weekStart)
  return rankings.find(r => r.user_id === userId)
}

export async function addPoints(userId: string, points: number, reason: string) {
  const supabase = createServerClient()
  const weekStart = getWeekStart()

  try {
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

    return { success: true }
  } catch (error) {
    console.error('Error adding points:', error)
    return { error: 'ポイント追加に失敗しました' }
  }
}
