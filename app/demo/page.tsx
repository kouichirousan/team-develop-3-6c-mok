'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CheckInButton from '@/components/CheckInButton'
import OceanVibeHeatmap from '@/components/OceanVibeHeatmap'
import BadgeCard from '@/components/BadgeCard'
import { isEarlyBird, calculatePoints } from '@/lib/utils'
import { mockUserBadges, mockUsers } from '@/lib/mock-data'
import type { BadgeType } from '@/types'
import { Sparkles, Award, Clock } from 'lucide-react'

export default function DemoPage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkedInCount, setCheckedInCount] = useState(12)
  const [currentUserPoints, setCurrentUserPoints] = useState(450)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false)
  const [unlockedBadge, setUnlockedBadge] = useState<BadgeType | null>(null)
  const [displayedBadges, setDisplayedBadges] = useState<BadgeType[]>(['early_bird_bronze'])
  const [simulationLog, setSimulationLog] = useState<string[]>([])
  
  const currentUserId = 'user-1'
  const currentUser = mockUsers.find(u => u.id === currentUserId)!
  const userBadges = mockUserBadges[currentUserId] || []

  const addLog = (message: string) => {
    setSimulationLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 9)])
  }

  const handleCheckIn = async () => {
    const now = new Date()
    const earlyBird = isEarlyBird(now)
    const points = calculatePoints(earlyBird)

    if (!isCheckedIn) {
      // Check-in
      setIsCheckedIn(true)
      setCheckedInCount(prev => prev + 1)
      setCurrentUserPoints(prev => prev + points)
      
      addLog(`✅ チェックイン完了！`)
      
      if (earlyBird) {
        addLog('🌅 早起き鳥ボーナス！')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        
        // Simulate badge unlock
        if (!userBadges.includes('early_bird_silver')) {
          setTimeout(() => {
            setUnlockedBadge('early_bird_silver')
            setShowBadgeUnlock(true)
            addLog('🏆 新しいバッジ獲得: 早起き鳥 (Silver)')
            setTimeout(() => setShowBadgeUnlock(false), 4000)
          }, 2000)
        }
      }
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
    } else {
      // Check-out
      setIsCheckedIn(false)
      setCheckedInCount(prev => prev - 1)
      addLog('👋 チェックアウト完了！お疲れ様でした')
    }
  }

  const handleBadgeToggle = (badgeType: BadgeType) => {
    if (!userBadges.includes(badgeType)) return
    
    setDisplayedBadges(prev => {
      if (prev.includes(badgeType)) {
        addLog(`📌 バッジを非表示: ${badgeType}`)
        return prev.filter(b => b !== badgeType)
      } else if (prev.length < 3) {
        addLog(`📌 バッジを表示: ${badgeType}`)
        return [...prev, badgeType]
      }
      return prev
    })
  }

  return (
    <main className="min-h-screen p-8">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -20, 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  opacity: 1,
                  rotate: 0
                }}
                animate={{ 
                  y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 20,
                  opacity: 0,
                  rotate: 720
                }}
                transition={{ duration: 3, delay: Math.random() * 0.5 }}
                className="absolute text-4xl"
              >
                {['🎉', '⭐', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Badge Unlock Modal */}
      <AnimatePresence>
        {showBadgeUnlock && unlockedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-white p-8 rounded-3xl border-8 border-accent shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-md"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  className="text-8xl"
                >
                  🏆
                </motion.div>
                <h2 className="text-4xl font-bold">称号獲得！</h2>
                <p className="text-2xl">早起き鳥 (Silver)</p>
                <p className="text-gray-600">7日連続8時前チェックイン達成！</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">ホーム</h1>
              <p className="text-gray-600">今日のオフィスの様子</p>
            </div>
          </div>
        </motion.div>

        {/* Check-in Button */}
        <div className="flex justify-center py-8">
          <CheckInButton onCheckIn={handleCheckIn} isCheckedIn={isCheckedIn} />
        </div>

        {/* Ocean Vibe Heatmap */}
        <OceanVibeHeatmap checkedInCount={checkedInCount} totalCapacity={50} />
      </div>
    </main>
  )
}
