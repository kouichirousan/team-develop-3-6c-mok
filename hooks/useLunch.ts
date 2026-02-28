'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function useLunch() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([])
  const [lunchHistory, setLunchHistory] = useState<any[]>([])
  const [progress, setProgress] = useState({ count: 0, total: 5, progress: 0 })

  useEffect(() => {
    if (user) {
      loadPendingInvitations()
      loadLunchHistory()
      loadProgress()
    }
  }, [user])

  const loadPendingInvitations = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/lunch?userId=${user.id}&type=pending`)
      const data = await response.json()
      setPendingInvitations(data.invitations || [])
    } catch (error) {
      console.error('Error loading invitations:', error)
    }
  }

  const loadLunchHistory = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/lunch?userId=${user.id}&type=history`)
      const data = await response.json()
      setLunchHistory(data.history || [])
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  const loadProgress = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/lunch?userId=${user.id}&type=progress`)
      const data = await response.json()
      setProgress(data.progress || { count: 0, total: 5, progress: 0 })
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const sendInvitation = async (partnerId: string, lunchDate: string) => {
    if (!user) return { error: 'ログインが必要です' }

    setLoading(true)

    try {
      const response = await fetch('/api/lunch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          userId: user.id,
          partnerId,
          lunchDate,
        }),
      })

      const data = await response.json()

      if (data.error) {
        return { error: data.error }
      }

      return { success: true }
    } catch (error) {
      return { error: 'ランチ招待の送信に失敗しました' }
    } finally {
      setLoading(false)
    }
  }

  const respondToInvitation = async (invitationId: string, accept: boolean) => {
    if (!user) return { error: 'ログインが必要です' }

    setLoading(true)

    try {
      const response = await fetch('/api/lunch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          userId: user.id,
          invitationId,
          accept,
        }),
      })

      const data = await response.json()

      if (data.error) {
        return { error: data.error }
      }

      await loadPendingInvitations()
      await loadLunchHistory()
      await loadProgress()

      return { success: true }
    } catch (error) {
      return { error: '招待への返信に失敗しました' }
    } finally {
      setLoading(false)
    }
  }

  return {
    sendInvitation,
    respondToInvitation,
    pendingInvitations,
    lunchHistory,
    progress,
    loading,
    refresh: () => {
      loadPendingInvitations()
      loadLunchHistory()
      loadProgress()
    },
  }
}
