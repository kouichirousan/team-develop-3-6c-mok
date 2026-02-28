'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CheckInButton from '@/components/CheckInButton'
import VibeHeatmap from '@/components/VibeHeatmap'
import BadgeCard from '@/components/BadgeCard'
import { supabase } from '@/lib/supabase'
import { isEarlyBird, calculatePoints, getWeekStart } from '@/lib/utils'
import type { BadgeType } from '@/types'
import { Sparkles, Award } from 'lucide-react'

export default function Home() {
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
    return null
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    // Load current check-ins count
    const { data: checkIns } = await supabase
      .from('checkins')
      .select('id')
      .is('checked_out_at', null)
    
    setCheckedInCount(checkIns?.length || 0)
  }

  const handleCheckIn = async () => {
    const now = new Date()
    const earlyBird = isEarlyBird(now)
    const points = calculatePoints(earlyBird)

    // Insert check-in record
    const { error } = await supabase
      .from('checkins')
      .insert({
        user_id: currentUserId,
        checked_in_at: now.toISOString(),
        is_early_bird: earlyBird,
        points_earned: points,
      })

    if (!error) {
      setIsCheckedIn(!isCheckedIn)
      setCheckedInCount(prev => isCheckedIn ? prev - 1 : prev + 1)
      
      if (earlyBird && !isCheckedIn) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }
  }

  return (
    <main className="min-h-screen p-8">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ y: window.innerHeight + 20, opacity: 0 }}
              transition={{ duration: 3, delay: Math.random() * 0.5 }}
              className="absolute text-4xl"
            >
              {['🎉', '⭐', '🎊', '✨'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold mb-2">
            彦田ブルー（仮名前）
          </h1>
          <p className="text-xl text-gray-600">オフィスの雰囲気を可視化し、交流を促進</p>
        </motion.div>

        {/* Vibe Heatmap */}
        <VibeHeatmap checkedInCount={checkedInCount} />

        {/* Check-in Button */}
        <div className="flex justify-center py-8">
          <CheckInButton onCheckIn={handleCheckIn} isCheckedIn={isCheckedIn} />
        </div>

        {/* Today's Lucky Person */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-accent" size={32} />
            <h2 className="text-2xl font-bold">今日のラッキーパーソン</h2>
          </div>
          <div className="flex items-center gap-4 p-4 bg-accent/20 rounded-xl">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              佐
            </div>
            <div>
              <h3 className="font-bold text-lg">佐藤花子</h3>
              <p className="text-sm text-gray-600">デザイン部</p>
              <p className="text-sm text-primary font-semibold mt-1">雑談OK 💬</p>
            </div>
          </div>
        </motion.div>

        {/* Badges Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-vibe-hot" size={32} />
            <h2 className="text-2xl font-bold">バッジコレクション</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BadgeCard badgeType="early_bird_bronze" isEarned={true} isDisplayed={true} />
            <BadgeCard badgeType="food_fighter" isEarned={false} />
            <BadgeCard badgeType="office_guardian" isEarned={false} />
          </div>
        </motion.div>
      </div>
    </main>
  )
}
