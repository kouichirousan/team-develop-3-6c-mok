'use server'

import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { addPoints } from './ranking'

export async function sendLunchInvitation(requesterId: string, partnerId: string, lunchDate: string) {
  const supabase = createServerClient()

  try {
    // Check if already invited
    const { data: existing } = await supabase
      .from('lunch_logs')
      .select('*')
      .eq('requester_id', requesterId)
      .eq('partner_id', partnerId)
      .eq('lunch_date', lunchDate)
      .single()

    if (existing) {
      return { error: '既に招待済みです' }
    }

    const { data, error } = await supabase
      .from('lunch_logs')
      .insert({
        requester_id: requesterId,
        partner_id: partnerId,
        lunch_date: lunchDate,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/demo/lunch')
    return { success: true, invitation: data }
  } catch (error) {
    console.error('Error sending lunch invitation:', error)
    return { error: 'ランチ招待の送信に失敗しました' }
  }
}

export async function respondToLunchInvitation(invitationId: string, userId: string, accept: boolean) {
  const supabase = createServerClient()

  try {
    const status = accept ? 'accepted' : 'rejected'

    const { error } = await supabase
      .from('lunch_logs')
      .update({ status })
      .eq('id', invitationId)
      .eq('partner_id', userId)

    if (error) throw error

    revalidatePath('/demo/lunch')
    return { success: true }
  } catch (error) {
    console.error('Error responding to invitation:', error)
    return { error: '招待への返信に失敗しました' }
  }
}

export async function completeLunch(invitationId: string) {
  const supabase = createServerClient()

  try {
    // Get invitation details
    const { data: invitation } = await supabase
      .from('lunch_logs')
      .select('*')
      .eq('id', invitationId)
      .single()

    if (!invitation) {
      return { error: 'ランチ記録が見つかりません' }
    }

    // Check if this is first lunch with this person
    const { data: previousLunches } = await supabase
      .from('lunch_logs')
      .select('*')
      .eq('status', 'completed')
      .or(`requester_id.eq.${invitation.requester_id},partner_id.eq.${invitation.requester_id}`)
      .or(`requester_id.eq.${invitation.partner_id},partner_id.eq.${invitation.partner_id}`)

    const isFirstLunch = !previousLunches || previousLunches.length === 0

    // Update status
    const { error } = await supabase
      .from('lunch_logs')
      .update({ status: 'completed' })
      .eq('id', invitationId)

    if (error) throw error

    // Award points for first lunch
    if (isFirstLunch) {
      await addPoints(invitation.requester_id, 50, 'First lunch together')
      await addPoints(invitation.partner_id, 50, 'First lunch together')
    } else {
      await addPoints(invitation.requester_id, 5, 'Lunch together')
      await addPoints(invitation.partner_id, 5, 'Lunch together')
    }

    // Check for food fighter badge
    await checkFoodFighterBadge(invitation.requester_id)
    await checkFoodFighterBadge(invitation.partner_id)

    revalidatePath('/demo/lunch')
    return { success: true, isFirstLunch }
  } catch (error) {
    console.error('Error completing lunch:', error)
    return { error: 'ランチ完了の記録に失敗しました' }
  }
}

export async function getPendingInvitations(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('lunch_logs')
    .select(`
      *,
      requester:user_profiles!lunch_logs_requester_id_fkey(name, department)
    `)
    .eq('partner_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching invitations:', error)
    return []
  }

  return data
}

export async function getLunchHistory(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('lunch_logs')
    .select(`
      *,
      requester:user_profiles!lunch_logs_requester_id_fkey(name, department),
      partner:user_profiles!lunch_logs_partner_id_fkey(name, department)
    `)
    .or(`requester_id.eq.${userId},partner_id.eq.${userId}`)
    .eq('status', 'completed')
    .order('lunch_date', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching lunch history:', error)
    return []
  }

  return data
}

export async function getFoodFighterProgress(userId: string) {
  const supabase = createServerClient()

  // Get user's department
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('department')
    .eq('id', userId)
    .single()

  if (!userProfile) return { count: 0, total: 5 }

  // Get completed lunches with different departments
  const { data: lunches } = await supabase
    .from('lunch_logs')
    .select(`
      *,
      requester:user_profiles!lunch_logs_requester_id_fkey(department),
      partner:user_profiles!lunch_logs_partner_id_fkey(department)
    `)
    .or(`requester_id.eq.${userId},partner_id.eq.${userId}`)
    .eq('status', 'completed')

  if (!lunches) return { count: 0, total: 5 }

  // Count unique departments (excluding own department)
  const uniqueDepartments = new Set<string>()
  for (const lunch of lunches) {
    const otherDept = lunch.requester_id === userId 
      ? lunch.partner?.department 
      : lunch.requester?.department
    
    if (otherDept && otherDept !== userProfile.department) {
      uniqueDepartments.add(otherDept)
    }
  }

  return {
    count: uniqueDepartments.size,
    total: 5,
    progress: (uniqueDepartments.size / 5) * 100,
  }
}

async function checkFoodFighterBadge(userId: string) {
  const supabase = createServerClient()
  const progress = await getFoodFighterProgress(userId)

  if (progress.count >= 5) {
    const { data: existingBadge } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_type', 'food_fighter')
      .single()

    if (!existingBadge) {
      await supabase
        .from('badges')
        .insert({
          user_id: userId,
          badge_type: 'food_fighter',
        })
    }
  }
}
