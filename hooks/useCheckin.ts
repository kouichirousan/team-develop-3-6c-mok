'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function useCheckin() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkIn = async () => {
    if (!user) {
      setError('ログインが必要です')
      return { error: 'ログインが必要です' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'check-in',
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return { error: data.error }
      }

      return data
    } catch (err) {
      const message = 'チェックインに失敗しました'
      setError(message)
      return { error: message }
    } finally {
      setLoading(false)
    }
  }

  const checkOut = async () => {
    if (!user) {
      setError('ログインが必要です')
      return { error: 'ログインが必要です' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'check-out',
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return { error: data.error }
      }

      return data
    } catch (err) {
      const message = 'チェックアウトに失敗しました'
      setError(message)
      return { error: message }
    } finally {
      setLoading(false)
    }
  }

  const getActiveCheckIn = async () => {
    if (!user) return null

    try {
      const response = await fetch(`/api/checkin?userId=${user.id}`)
      const data = await response.json()
      return data.activeCheckIn
    } catch (err) {
      console.error('Error fetching active check-in:', err)
      return null
    }
  }

  return {
    checkIn,
    checkOut,
    getActiveCheckIn,
    loading,
    error,
  }
}
